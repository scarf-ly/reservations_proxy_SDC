require('newrelic');
const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const morgan = require('morgan');

const app = express();
const apiProxy = httpProxy.createProxyServer();
const port = 3005;

const gallery = 'http://localhost:3000';
const reservation = 'http://localhost:3001';
const popular = 'http://localhost:3002';
const header = 'http://localhost:3003';


// app.use(morgan('dev'));
app.use('/:restaurantId', express.static(path.resolve('dist')));

// app.all('/gallery/:restaurantId', (req, res) => {
//   apiProxy.web(req, res, {target: gallery});
// });

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

// app.all('/header/:restaurantId', (req, res) => {
//   apiProxy.web(req, res, {target: header});
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

