'use strict'

module.exports = function(app){
    app.get('/users', (req, res, next) => {
        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        next();
    });

    app.get('/get-userinfo/:id', (req, res, next) => {
        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            return res.json({error: true, data: 'user id is require', code: 422});
        if (!ObjectId.isValid(req.params.id))
            return res.json({error: true, data: 'user id null or malformed', code: 422});
        next();
    });

    app.get('/user/me', (req, res, next) => {
        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        next();
    });

    app.get('/get-balance/:id', (req, res, next) => {
        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            return res.json({error: true, data: 'user id is require', code: 422});
        if (!ObjectId.isValid(req.params.id))
            return res.json({error: true, data: 'user id null or malformed', code: 422});
        next();
    });

    app.get('/balance/me', (req, res, next) => {
        if(!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        next();
    });
};
