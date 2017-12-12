'use strict';

const wallet = require('../../utils/wallet');
const config = require('../../config/configuration');

module.exports = {
    createUser: async(data) => {
        try {
            let newWallet = wallet.createNewWallet(password);
            data.address = newWallet.address;
            data.keystore = newWallet.keystore;
            data.balance = config.FAUCET_AMOUNT;
            data.faucetedAt = new Date();
            return await user.create(data);
        } catch (error) {
            throw error;
        }
    },
};
