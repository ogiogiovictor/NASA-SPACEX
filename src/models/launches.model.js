const axios = require('axios');
const planets = require('./planets.mongo');
const LaunchDatabase = require('./launches.mongo');

/* const launch = {
    // flightNumber: 100,
    // mission: 'Kepler Exploration X',
    // rocket: 'Explorer IS1',
    // target: 'Kepler-442 b',
    // launchDate: new Date('December 27, 2030'),
    // customers: ['ZTM', 'NASA'],
    // upcoming: true,
    // success: true,
}
*/

//saveLaunches(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';


async function findLaunch(filter){
    return await LaunchDatabase.findOne(filter);
}

async function existLaunchWithId(launchId) {
   // return await LaunchDatabase.findOne({ flightNumber: launchId });
    return await findLaunch({ flightNumber: launchId });
}


async function loadLaunchData() {

  const launchFound =   await findLaunch({ 
        flightNumber: 1, 
        rocket: 'Falcon 1',
        mission: 'FalconSat', 
    });

    if(launchFound) {
        console.log('Launch data already loaded');
    }else{
        await populateLaunches();
    }
}

async function populateLaunches() {
    console.log("Downloading louanch data from SpaceX");
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    },
                },
                {
                    path: 'payloads',
                    select:{ 'customers': 1 }
                }
            ]
        }
    });

    if(response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }


    const LaunchDocs = response.data.docs;
    for(const launchDoc of LaunchDocs) {
       
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);

        //populate launches collection
        await saveLaunches(launch);
    }
}


async function getAllLaunches(skip, limit) {
  //  return Array.from(launches.values());
  //Implementing Pagination with MongoDB
  return await LaunchDatabase.find({}, { '_id': 0, '__v': 0 })
  .sort({ flightNumber: 1}) // Sort by flightNumber in ascending order 1 for ascending order -1 for descending order
  .skip(skip)
  .limit(limit);
}

async function getLatestFlightNumber() {
    const latestLaunch = await LaunchDatabase.findOne().sort('-flightNumber'); //Sort by flightNumber in descending order
    return latestLaunch ? latestLaunch.flightNumber : 1;
}

async function saveLaunches(launch) {
      await LaunchDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {upsert: true});
}

async function scheduleNewLaunch(launch) {

    const planet =  await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet) {
        throw new Error('No matching planet found');
    }

    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunches(newLaunch);
};

async function abortLaunchById(launchId) {
    const aborted = await LaunchDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;
   // return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    addNewLaunch : scheduleNewLaunch,
    existLaunchWithId,
    abortLaunchById
}