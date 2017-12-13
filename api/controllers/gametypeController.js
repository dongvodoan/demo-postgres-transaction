'use strict';

module.exports = {
    postGameType: asyncWrap(async (req, res) => {
        let newGameType = await gametype.create(req.body);
        res.json({error: false, data: newGameType});
    }),

    getAllGameType: asyncWrap(async (req, res) => {
        let gameTypes = await gametype.find({});
        res.json({error: false, data: gameTypes});
    })
}