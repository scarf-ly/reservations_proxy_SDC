require('newrelic');
const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const morgan = require('morgan');

const app = express();
const apiProxy = httpProxy.createProxyServer();
const port = 3005;

const gallery = 'http://ec2-34-217-16-94.us-west-2.compute.amazonaws.com';
const reservation = 'http://54.183.216.157';
const popular = 'http://localhost:3002';
const header = 'http://ec2-18-188-246-230.us-east-2.compute.amazonaws.com';


// app.use(morgan('dev'));
app.use('/:restaurantId', express.static(path.resolve('dist')));

app.all('/:restaurantId/gallery', (req, res) => {
  apiProxy.web(req, res, {target: gallery});
});

app.get('/:restaurantId/reservation', (req, res) => {
  apiProxy.web(req, res, {target: reservation});
});

app.get('/:restaurantId/restaurantCapacity', (req, res) => {
  apiProxy.web(req, res, {target: reservation});
});

app.post('/:restaurantId/reservation', (req, res) => {
  apiProxy.web(req, res, {target: reservation});
});

// app.all('/popular/:restaurantId', (req, res) => {
//   apiProxy.web(req, res, {target: popular});
// });

app.all('/:restaurantId/header/', (req, res) => {
  apiProxy.web(req, res, {target: header});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

