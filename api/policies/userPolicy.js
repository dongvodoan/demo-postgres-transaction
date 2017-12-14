'use strict'

module.exports = function(app){
    app.use('/users', (req, res, next) => {
        if (!req.user)
            res.json({error: true, data: 'unauthorized', code: 401});
        next();
    });

    app.use('/get-userinfo/:id', (req, res, next) => {
        if (!req.user)
            res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            res.json({error: true, data: 'user id is require', code: 422});
        next();
    });

    app.use('/user/me', (req, res, next) => {
        if (!req.user)
            res.json({error: true, data: 'unauthorized', code: 401});
        next();
    });

    app.use('/get-balance/:id', (req, res, next) => {
        if (!req.user)
            res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            res.json({error: true, data: 'user id is require', code: 422});
        next();
    });

    app.use('/balance/me', (req, res, next) => {
        if(!req.user)
            res.json({error: true, data: 'unauthorized', code: 401});
        next();
    });
};
