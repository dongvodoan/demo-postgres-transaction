'use strict';

var config = require('../../config/configuration');

module.exports = {
    /**
     * Get all users
     */
    getUsers: asyncWrap(async (req, res) => {
        let users = await user.find({});
        res.json({error: false, data: users});
    }),

    /**
     * Get detail user
     */
    getUser: asyncWrap(async (req, res) => {
        let userId = req.params.id;
        let user = await userRepository.getUser(userId);
        res.json({error: false, data: user});
    }),

    /**
     * Get current user login
     */
    getProfile: asyncWrap(async (req, res) => {
        let userId = req.user._id;
        let user = await userRepository.getUser(userId);
        res.json({error: false, data: user});
    }),

    getHistoryTransactions: asyncWrap(async (req, res) => {
        let histories = await historyTransaction.find({});
        res.json({error: false, data: histories});
    }),

    getBalanceByUser: asyncWrap(async (req, res) => {
        let userId = req.params.id;
        let deposit = await userRepository.getDepositBalanceByUser(userId);
        res.json({error: false, data: deposit});
    }),

    getBalanceByMe: asyncWrap(async (req, res) => {
        let userId = req.user._id;
        let deposit = await userRepository.getDepositBalanceByUser(userId);
        res.json({error: false, data: deposit});
    })
}
