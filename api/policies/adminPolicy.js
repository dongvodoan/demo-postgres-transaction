'use strict'

module.exports = function(app){
    app.use('/admin/*', (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({error: true, data: 'unauthorized', code: 401});
        } else if (req.user.role !== 1) {
            return res.status(401).json({error: true, data: 'unauthorized', code: 401});
        }
        next();
    });
};
