require('newrelic');
const request = require('request');
const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const morgan = require('morgan');

const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const redisClient = redis.createClient(REDIS_PORT);

const app = express();
const apiProxy = httpProxy.createProxyServer();
const port = 3005;

const gallery = 'http://ec2-34-217-16-94.us-west-2.compute.amazonaws.com';
const reservation = 'http://54.183.216.157';
const popular = 'http://localhost:3002';
const header = 'http://ec2-18-188-246-230.us-east-2.compute.amazonaws.com';

app.get('/loaderio-5da5e0ba28c25911b40440f3e1f7b20d', (req, res) => {
  res.send('loaderio-5da5e0ba28c25911b40440f3e1f7b20d')
});

const restaurantCache = (req, res, next) => {
  const { restaurantId } = req.params;
  redisClient.get(restaurantId.toString(), (err, data) => {
    if (data != null) {
      res.send(data);
    } else {
      next();
    }
  });
}

const reservationCache = (req, res, next) => {
  const { restaurantId } = req.params;
  const { timestamp } = req.query;
  redisClient.get(restaurantId.toString() + timestamp.toString(), (err, data) => {
    if (data != null) {
      res.send(data);
    } else {
      next();
    }
  });
}

// app.use(morgan('dev'));
app.use('/:restaurantId', express.static(path.resolve('dist')));

app.all('/:restaurantId/gallery', (req, res) => {
  apiProxy.web(req, res, {target: gallery});
});

app.get('/:restaurantId/reservation', reservationCache, (req, res) => {
  const { restaurantId } = req.params;
  const { timestamp } = req.query;
  request(`${reservation}/${restaurantId}/reservation?timestamp=${timestamp}`, (err, response, body) => {
    if (err) {
      console.log(err)
    } else {
      redisClient.set(restaurantId.toString() + timestamp.toString(), body)
      res.send(body);
    }
  });
  // apiProxy.web(req, res, {target: reservation});
});


app.get('/:restaurantId/restaurantCapacity', restaurantCache, (req, res) => {
  const { restaurantId } = req.params;
  request(`${reservation}/${restaurantId}/restaurantCapacity`, (err, response, body) => { // ${reservation} is the variable that points to the IP my service is running on in AWS
    if (err) {
      console.log(err)
    } else {
      redisClient.set(restaurantId.toString(), body);
      res.send(body);
    }
  });
  // apiProxy.web(req, res, {target: reservation}); // This is the old http proxy, will delete
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

