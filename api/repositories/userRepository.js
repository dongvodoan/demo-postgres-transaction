'use strict';

const config = require('../../config/configuration');

module.exports = {
    createUser: async(data) => {
        try {
            return await user.create(data);
        } catch (error) {
            throw error;
        }
    },

    getUser: async(userId) => {
        try {
            let promise = await Promise.all([
                user.findOne({_id: userId}),
                userRepository.getDepositBalanceByUser(userId),
            ]); 
            let data = {
                deposit: promise[1]
            }
            data = Object.assign({}, data, promise[0]._doc);
            return data;
        } catch (error) {
            throw error;
        }
    },

  
    /**
     * @API: Get deposit balance BAP platform
     * @param: userid Server Game
     * @return: deposit Current coin of user
     */
    getDepositBalanceByUser: async(userId) => {
        try {
            let url = `${config.BAPUri}deposit-balance`;
            let deposit = 0;
            let userData = await user.findOne({_id: userId});
            let accessToken = userData.accessToken ? userData.accessToken : '';
            let responseData = await httpService.getPlatform(url, accessToken);
            if (responseData.status === 200) {
                deposit = responseData.data.deposit ? responseData.data.deposit : deposit;
            }
            return deposit;
        } catch (error) {
            throw error;
        }
    },
};
