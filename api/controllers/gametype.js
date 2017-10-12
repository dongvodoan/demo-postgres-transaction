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
    getAllGameType: function(cb){
        GameType.find({}, function(err, data){
            if(err){
                cb(true, err);
            } else {
                cb(false, data);
            }
        });
    }
}