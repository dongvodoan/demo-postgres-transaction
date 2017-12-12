'use strict'

module.exports = function(app){
    app.use('/login/bap-platform', (req, res, next) => {
        if(!req.user) {
            res.json({error: true, data: 'unauthorized', code: 401});
        }
        next();
    });
};
