'use strict'

module.exports = function(app){
    app.use('/users', (req, res, next) => {
        if(!req.user) {
            res.json({error: true, data: 'unauthorized', code: 401});
        }
        next();
    });

    app.use('/get-userinfo/:id', (req, res, next) => {
        if(!req.user) {
            res.json({error: true, data: 'unauthorized', code: 401});
        }
        next();
    });

    app.use('/user/me', (req, res, next) => {
        if(!req.user) {
            res.json({error: true, data: 'unauthorized', code: 401});
        }
        next();
    });
};
