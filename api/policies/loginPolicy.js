'use strict'

module.exports = function(app){
    app.use('/login/bap-platform', (req, res, next) => {
        if(!req.body.accessToken) {
            res.json({error: true, data: 'access token is require', code: 422});
        }
        next();
    });
};
