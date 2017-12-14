'use strict'

module.exports = function(app){
    app.use('/admin/*', (req, res, next) => {
        let admin = req.headers['admin'];
        if(admin !== 'kbrgame') {
            return res.json({error: true, data: 'unauthorized', code: 401});
        }
        next();
    });

    app.post('/admin/game-type', (req, res, next) => {
        let name = req.body.name;
        let description = req.body.description;
        let ratio = req.body.ratio;
        let appId = req.body.appId;

        if (!name)
            return res.json({error: true, data: 'name is require', code: 422});
        if(!description)
            return res.json({error: true, data: 'description is require', code: 422});
        if (!ratio)
            return res.json({error: true, data: 'ratio is require', code: 422});
        if (!appId)
            return res.json({error: true, data: 'appId is require', code: 422});
        next();
    });
};
