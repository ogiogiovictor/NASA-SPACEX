const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({comment: '#', columns: true})) // parse the data and connect readStream of csv file to parse
        .on('data', async (data) => {
            if(isHabitablePlanet(data)) {
                //Don't save to array, save to database
                //habitablePlanets.push(data);

                //Save to MongoDB instead
                savenPlanet(data);

            }
        
        })
        .on('error', (err) => { 
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const countPlantetsFound = (await getAllPlanents()).length;
            console.log(`${countPlantetsFound} habitable planets found!`);
            resolve();
        });
    });
}

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

async function getAllPlanents() {
    return await planets.find({}, '-_id -__v'); // -_id -__v means exclude these two fields
}

async function savenPlanet(planet) {
    try {
        await planets.updateOne(
            {
                keplerName: planet.kepler_name,
            }, 
            { keplerName: planet.kepler_name,},
            { upsert: true });
    } catch (err) {
        console.error(`Could not save planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    planets: getAllPlanents
}


