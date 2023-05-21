const express = require('express');
const app = express();

const apiRoutes = require('./api');
const pageRoutes = require('./pages');

app.use('/api', apiRoutes);
app.use('/', pageRoutes);

module.exports = app;