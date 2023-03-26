const express = require('express');
const launchesController = require('./launches.controller');

const launchesRouter = express.Router();

// This is our first route
launchesRouter.get('/', launchesController.httpgetAllLaunches);
launchesRouter.post('/', launchesController.httpAddNewLaunch);
launchesRouter.delete('/:id', launchesController.httpAbortLaunch);

module.exports = launchesRouter;