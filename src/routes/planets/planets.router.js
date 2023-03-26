const express = require('express');
const planetsController = require('./planets.controller');

const planetsRouter = express.Router();

// This is our first route
planetsRouter.get('/', planetsController.getAllPlanets);

module.exports = planetsRouter;