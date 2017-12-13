'use strict'

module.exports = function(app){
    app.use('/faker/*', (req, res, next) => {
        let faker = req.headers['faker'];
        res.header('Access-Control-Allow-Origin', '*');
        if(faker !== 'fk123') {
            res.json({error: true, data: 'fake off', code: 400});
        }
        next();
    });
};