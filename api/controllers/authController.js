'use strict';

const config = require('../../config/configuration');

module.exports = {

    callbackPlatform: asyncWrap(async (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        let accessToken = req.body.accessToken;
        let url = `${config.BAPUri}user`;

        if (accessToken === undefined || accessToken.trim() === "") {
            res.json({error: true, data: 'accessToken is required'});
        } else {
            let response = await httpService.getPlatform(url, accessToken);
            if (response.status && response.status === 200) {
                let userPlatform = response.data;
                let checkUser = await user.findOne({email: userPlatform.email});
                if(checkUser) {
                    if (checkUser.accessToken !== accessToken) {
                        await user.findByIdAndUpdate({_id:checkUser.id}, {accessToken:accessToken});
                    }
                    res.json({error: false, data: checkUser});
                } else {
                    let data = {
                        email: userPlatform.email
                    };
                    let newUser = await userRepository.createUser(data);
                    return res.ok({error: false, data: newUser});
                }
            }
            res.json({error: true, data: 'bad request'});
        }
    }),
};
