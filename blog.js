'use strict'

const express = require('express');
const bodyParser = require('body-parser');
let config = require('./config/development');
const app = new express();

if (process.env.NODE_ENV === 'production') {
    config = require('./config/production');
}

//  middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.asyncWrap = (fn, errorCallback) => {
    return (req, res, next) => {
        fn(req, res, next).catch(error => {
            if (errorCallback){
                errorCallback(req, res, error);
            } else {
                if (process.env.NODE_ENV !== 'production') {
                    return res.json({error: true, data: 'Server error', code: 500});
                }
                return res.json({error: true, data: 'bad request', code: 400});
            }
        })
    }
};

global.config = config;

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    database: 'demo',
    password: '24071994',
    port: 5434,
});

global.pool = pool;

//  api
require('./api/routes/demo')(app);

// 404 not found
app.use('*', (req, res, next) => {
    res.status(404).json({error: true, data: "Not found", code:404});
    next();
});

app.listen(config.port, function(err) {
    if (err) {
        console.log('Start server error');
    } else {
        console.log(
            `
              =====================================================
              -> Server Blog 🏃 (running) on: http://localhost:${config.port}
              =====================================================
            `
        );
    }
});
