'use strict'

module.exports = function(app){
    app.post('/login/bap-platform', (req, res, next) => {
        if (!req.body.accessToken) {
            return res.json({error: true, data: 'access token is require', code: 422});
        }
        next();
    });
};
