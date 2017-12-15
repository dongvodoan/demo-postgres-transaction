'use strict';

const config = require('../../config/configuration');
const gameTypeData = require('../data/gametype');

module.exports = {
    cleanAll: asyncWrap(async (req, res) => {
        let promise = await Promise.all([
            game.remove({}),
            gametype.remove({}),
            historyTransaction.remove({}),
            user.remove({})
        ]);
        if (!promise)
            res.json({error: false, data: 'Clean All Database had been unsuccessfully!'});
        res.json({error: false, data: 'Clean All Database had been successfully!'});
    }),

    cleanDBForProd: asyncWrap(async (req, res) => {
        await gametype.remove({});
        res.json({error: false, data: "Clean DB (without clean game type) had been successfully!"});
    }),

    fakeGameType: asyncWrap(async (req, res) => {
        await gametype.remove({});
        let fake = await gametype.create(gameTypeData);
        if (!fake)
            res.json({error: false, data: 'Fake game type had been unsuccessfully!'});
        res.json({error: false, data: 'Fake game type had been successfully!'});
    })
};
