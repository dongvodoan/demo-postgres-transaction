'use strict'

module.exports = {
    createNewGameMatch: async(gameTypeId, player1, player2, amount) => {
        try {
            let gameMatch = {
                gameTypeId,
                amount,
                player1,
                player2,
                winner: null,
                status: 0,
            }
            return await game.create(gameMatch);
        } catch(error) {
            throw error;
        }
    },

    getGameTypeRatio: async(gameTypeId) => {
        try {
            let gameType = await gametype.findOne({_id: gameTypeId});
            return gameType.ratio;
        } catch(error) {
            throw error;
        }
    },

    insertNewGameMultiPlayers: async(gameTypeId, players, amount) => {
        try {
            let gameMatch = {
                gameTypeId,
                amount,
                players,
                winner: null,
                status: 0
            }
            return await game.create(gameMatch);
        } catch(error) {
            throw error;
        }
    }
};
