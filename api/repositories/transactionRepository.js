'use strict'

const config = require('../../config/configuration');

module.exports = {
    /**
     * @API: Post subtract coin of user BAP platform
     * @param: - userId Server Tokubuy
     *         - amount subtract
     * @return: data
     */
    postSubtractAmount: async(userId, amount) => {
        try {
            let url = `${config.BAPUri}transaction/subtract`;
            let body = {
                "amount": amount,
                "app_id": config.BAPAppId,
            };
            let userData = await user.findOne({_id: userId});
            let accessToken = userData.accessToken ? userData.accessToken : '';
            let data = await httpService.postPlatform(url, accessToken, body);
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * @API: Post add coin of user BAP platform
     * @param: - userId server Tokubuy
     *         - amount add
     * @return: data
     */
    postAddAmount: async(userId, amount) => {
        try {
            let url = `${config.BAPUri}transaction/add`;
            let body = {
                "amount": amount,
                "app_id": config.BAPAppId,
            };
            let userData = await user.findOne({_id: userId});
            let accessToken = userData.accessToken ? userData.accessToken : '';
            let data = await httpService.postPlatform(url, accessToken, body);
            return data;
        } catch (error) {
            throw error;
        }
    },
};
