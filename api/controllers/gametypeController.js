'use strict';

var GameType = require('../models/gametype');

module.exports = {
    insertGameType: function(name, description, ratio){
        var gameType = new GameType();
        gameType.name = name;
        gameType.description = description;
        gameType.ratio = ratio;

        gameType.save();
    },

    getAllGameType: asyncWrap(async (req, res) => {
        let games = await gametype.find({});
        res.json({error: false, data: games});
    })
}