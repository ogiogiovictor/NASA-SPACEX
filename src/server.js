//const http = require('http');
const fs = require('fs');
const https = require('https');
//require('dotenv').config();


//const mongoose = require('mongoose');


//Using the cluster module
//const cluster = require('cluster');
//Using the os module which is part of performance
//const os = require('os');
const app = require('./app');
const { mongoConnect } = require('../services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');


const PORT = process.env.PORT || 8001;

//const MONGO_URL = "mongodb+srv://onos:YL5XsE3kyZ5VMv8Q@cluster0.vwwqsju.mongodb.net/nasa?retryWrites=true&w=majority";

const server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
}, app);

/*
mongoose.connection.once('open', () => { 
    console.log("MongoDB connection is open...");
});

mongoose.connection.on('error', (err) => { 
    console.error("MongoDB connection error...". $err);
});
*/

async function startServer() {

    await mongoConnect();
  /*  await mongoose.connect(MONGO_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true
    });
    */

    await loadPlanetsData();

    //SpaceX
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    //Clustering
   /* if(cluster.isMaster){
        console.log("Master has been started...");
       // cluster.fork();
        //cluster.fork();
        const NUM_WORKERS = os.cpus().length;
        for(let i = 0; i < NUM_WORKERS; i++){
            cluster.fork();
        }

    }else{ 
        console.log("Worker has been started...");
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } */
}

startServer();

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

