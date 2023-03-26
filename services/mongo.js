const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => { 
    console.log("MongoDB connection is open...");
});

mongoose.connection.on('error', (err) => { 
    console.error("MongoDB connection error...". $err);
});

async function mongoConnect(){
    await mongoose.connect(MONGO_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true
    });
}


module.exports = {
    mongoConnect
}