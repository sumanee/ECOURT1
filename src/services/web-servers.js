const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./router.js');
const addHeader = require('../utils/addHeader');

let httpServer;

dotenv.config();

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    app.use(cors());
    app.use(addHeader);

    app.use('/api', router);

    httpServer
      .listen(process.env.PORT)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${process.env.PORT}`);
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close(err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

module.exports.close = close;
