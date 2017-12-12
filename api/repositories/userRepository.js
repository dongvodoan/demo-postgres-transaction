'use strict';

const wallet = require('../../utils/wallet');
const config = require('../../config/configuration');

module.exports = {
    createUser: async(data) => {
        try {
            return await user.create(data);
        } catch (error) {
            throw error;
        }
    },
};
