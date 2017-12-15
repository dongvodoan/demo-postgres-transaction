
'use strict';

module.exports = {

    postNewGameMatch: asyncWrap(async (req, res) => {
        const gameTypeId   = req.body.gameTypeId;
        const player1  = req.body.player1;
        const player2  = req.body.player2;
        const amount = req.body.amount;
        let gameType = await gametype.findOne({_id: gameTypeId});
        let newGameMatch = await gameRepository.createNewGameMatch(gameTypeId, player1, player2, amount);
        if (newGameMatch) {
            let promise = await Promise.all([
                transactionRepository.postSubtractAmount(player1, amount, gameType.appId),
                transactionRepository.postSubtractAmount(player2, amount, gameType.appId),
                historyRepository.createHistoryTransaction(player1, amount, gameTypeId, 0),
                historyRepository.createHistoryTransaction(player2, amount, gameTypeId, 0),
            ]);

            if (promise[0].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[2]._id }, { $set: { status: 0 }});
            }
            if (promise[1].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[3]._id }, { $set: { status: 0 }});
            }
        }
        res.json({error: false, data: newGameMatch});
    }),

    postEndGame: asyncWrap(async (req, res) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;
        let updateGameMatch = await game.findByIdAndUpdate({_id: gameId}, {
            $set: {
                status: 1,
                winner: winner
            }
        }, {new: true}).populate('gameTypeId', 'appId');
        
        if (updateGameMatch) {
            let appId = updateGameMatch.gameTypeId.appId;
            let gameTypeId = updateGameMatch.gameTypeId._id;
            let ratio = await gameRepository.getGameTypeRatio({_id: gameTypeId});
            let amountAdd = updateGameMatch.amount * 2 * (1 - ratio);
            let promise = await Promise.all([
                transactionRepository.postAddAmount(winner, amountAdd, appId),
                historyRepository.createHistoryTransaction(winner, amountAdd, gameTypeId, 1),
            ]);

            if (promise[0].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[1]._id }, { $set: { status: 0 }});
            }
        }

        res.json({error: false, data: updateGameMatch});
    }),

    getAllGame: asyncWrap(async (req, res) => {
        let gameMaths =  await game.find({}).select('-__v');
        res.json({error: false, data: gameMaths});
    }),

    getHistoryByUserId: asyncWrap(async (req, res) => {
        let userId = req.params.id;
        let historyUser =  await game.find({$or: [{player1: userId}, {player2: userId}]}).select('-__v');
        res.json({error: false, data: historyUser});
    }),

    getGameById: asyncWrap(async (req, res) => {
        let gameId = req.params.id;
        let gameInfo = await game.findOne({_id: gameId}).select('-__v');
        res.json({error: false, data: gameInfo});
    }),

    insertGameMultiPlayers: asyncWrap(async (req, res) => {
        const gameTypeId   = req.body.gameTypeId;
        let players  = req.body.players.split(",");
        const amount = req.body.amount;
        let gameType = await gametype.findOne({_id: gameTypeId});
        let newGameMatch = await gameRepository.insertNewGameMultiPlayers(gameTypeId, players, amount);    
        if (newGameMatch) {
            players = newGameMatch.players;
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                let promise = await Promise.all([
                    transactionRepository.postSubtractAmount(player, amount, gameType.appId),
                    historyRepository.createHistoryTransaction(player, amount, gameTypeId, 0),
                ]);
                if (promise[0] !== 200) {
                    await historyTransaction.findByIdAndUpdate({ _id: promise[1]._id }, { $set: { status: 0 }});                    
                }
            }
        }
        res.json({error: false, data: newGameMatch});
    }),

    postEndGameMultiPlayers: asyncWrap(async (req, res) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;
        
        let updateGameMatch = await game.findByIdAndUpdate({_id: gameId}, {
            $set: {
                status: 1,
                winner: winner
            }
        }, {new: true}).populate('gameTypeId', 'appId');
        
        if (updateGameMatch) {
            let appId = updateGameMatch.gameTypeId.appId;
            let gameTypeId = updateGameMatch.gameTypeId._id;
            let ratio = await gameRepository.getGameTypeRatio({_id: gameTypeId});
            let amountAdd = updateGameMatch.amount * updateGameMatch.players.length * (1 - ratio);
            let promise = await Promise.all([
                transactionRepository.postAddAmount(winner, amountAdd, appId),
                historyRepository.createHistoryTransaction(winner, amountAdd, gameTypeId, 1),
            ]);

            if (promise[0].status !== 200) {
                await historyTransaction.findByIdAndUpdate({ _id: promise[1]._id }, { $set: { status: 0 }});
            }
        }

        res.json({error: false, data: updateGameMatch});
    }),
}
