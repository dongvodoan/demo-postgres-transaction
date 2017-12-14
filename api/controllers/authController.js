'use strict';

const config = require('../../config/configuration');

module.exports = {
    /**
     * Callback login BAP Platform Controller
     */
    callbackPlatform: asyncWrap(async (req, res) => {
        let accessToken = req.body.accessToken;
        let url = `${config.BAPUri}user`;

        let response = await httpService.getPlatform(url, accessToken);
        if (response.status && response.status === 200) {
            let userPlatform = response.data;
            let checkUser = await user.findOne({username: userPlatform.username});
            if(checkUser) {
                if (checkUser.accessToken !== accessToken) {
                    await user.findByIdAndUpdate({_id:checkUser.id}, {accessToken:accessToken});
                }
                let token = userService.generateUserToken({_id: checkUser.id});
                res.json({error: false, data: token});
            } else {
                let data = {
                    username: userPlatform.username,
                    accessToken: accessToken
                };
                let newUser = await userRepository.createUser(data);
                console.log(newUser);
                let token = userService.generateUserToken({_id: newUser.id});
                res.json({error: false, data: token});
            }
        }
        res.json({error: true, data: 'bad request'});
    }),
};
