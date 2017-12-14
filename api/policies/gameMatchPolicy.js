'use strict'

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = function(app){
    app.use('/playgame', asyncWrap(async (req, res, next) => {
        const gameTypeId   = req.body.gameTypeId;
        const player1  = req.body.player1;
        const player2  = req.body.player2;
        const amount = req.body.amount;

        if(!req.user) {
            res.json({error: true, data: 'unauthorized', code: 401});
        }

        if (!gameTypeId) {
            res.json({error: true,data: 'gameTypeId not found'});
        }
        if (!ObjectId.isValid(gameTypeId)){
            res.json({error: true,data: 'game type id null or malformed'});
        } 
        
        if (!player1) {
            res.json({error: true, data: 'player 1 not found'});
        }

        if (!ObjectId.isValid(player1)){
            res.json({error: true,data: 'player 1 id null or malformed'});
        } 
        
        if (!player2) {
            res.json({error: true, data: 'player 2 not found'});
        }

        if (!ObjectId.isValid(player2)){
            res.json({error: true,data: 'player 2 id null or malformed'});
        } 
        
        if (!amount) {
            res.json({error: true, data: 'amount not found'});
        } else if (isNaN(parseFloat(amount))) {
            res.json({error: true, data: 'amount is not number'});
        }

        if (player1 === player2)
            res.json({error: true, data: 'Can not play with yourself'});

        let promise = await Promise.all([
            gametype.count({_id: gameTypeId}),
            user.count({_id: player1}),
            user.count({_id: player2}),
            userRepository.getDepositBalanceByUser(player1),
            userRepository.getDepositBalanceByUser(player2)
        ]);

        if (!promise[0])
            res.json({error: true, data: 'game type not found'});

        if (!promise[1]) 
            res.json({error: true, data: 'player 1 not found'});  
        
        if (!promise[2]) 
            res.json({error: true, data: 'player 2 not found'}); 

        if (promise[3] < amount)
            res.json({error: true, data: 'player 1 enough coin'});

        if (promise[4] < amount)
            res.json({error: true, data: 'player 2 enough coin'});
         
        next();
    }));

    app.use('/endgame', async (req, res, next) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;

        if(!req.user) {
            res.json({error: true, data: 'unauthorized', code: 401});
        }

        if (!winner)
            res.json({error: true, data: 'winner not found'});
        if (!ObjectId.isValid(gameId))
            res.json({error: true,data: 'game id null or malformed'});
        if (!gameId)
            res.json({error: true, data: 'gameId not found'});
        if (!ObjectId.isValid(winner))
            res.json({error: true,data: 'winner id null or malformed'});

        let checkGame = await game.count({
            _id: gameId,
            winner: null, 
            $or: [{player1: winner}, {player2: winner}]
        });
        
        if (!checkGame)
            res.json({error: true, data: 'game not found or invalid winner'});

        if (!await user.count({_id: winner}))
            res.json({error: true, data: 'winner not found'});


        next();
    });

    app.use('/get-history/:id', (req, res, next) => {
        if(!req.user)
            res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            res.json({error: true, data: 'user id is require', code: 422});
        next();
    });

    app.use('/get-gameinfo/:id', (req, res, next) => {
        if (!req.user)
            res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            res.json({error: true, data: 'user id is require', code: 422});
        next();
    });

    app.use('/playgame2', async (req, res, next) => {
        const gameTypeId   = req.body.gameTypeId;
        let players  = req.body.players.split(",");
        const amount = req.body.amount;

        if (!req.user)
            res.json({error: true, data: 'unauthorized', code: 401}); 

        if (!gameTypeId)
            res.json({error: true,data: 'gameTypeId not found'});
        if (!await gametype.count({_id: gameTypeId}))
            res.json({error: true,data: 'game type not found'});
        if (!players)
            res.json({error: true, data: 'players not found'});
        
        if (!Array.isArray(players) || players.length < 2)
            res.json({error: true, data: 'Incorrect players'});
        
        if(!amount){
            res.json({error: true, data: 'amount not found'});
        } else if(isNaN(parseFloat(amount))){
            res.json({error: true, data: 'amount is not number'});
        }

        for (let i = 1; i <= players.length; i++){
            let player = players[i];
            if (!await user.count({_id: player}))
                res.json({error: true, data: `player ${i} not found`});
            if (await userRepository.getDepositBalanceByUser(player) < amount)
                res.json({error: true, data: `player ${i} enough coin`});
        };

        let isDuplicate = false;
        for (let i = 0; i < players.length - 1; i++){
            for (let j = i + 1; j < players.length; j++){
                if(players[i] === players[j]){
                    isDuplicate = true;
                    break;
                }
            }
            if(isDuplicate) break;
        }
        if (isDuplicate)
            res.json({error: true, data: 'Can not play with yourself'});

        next();
    });

    app.use('/endgame2', async (req, res, next) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;

        if(!req.user) {
            res.json({error: true, data: 'unauthorized', code: 401});
        }

        if (!winner)
            res.json({error: true, data: 'winner not found'});
        if (!await user.count({_id: winner}))
            res.json({error: true, data: 'winner not found'});
        if (!gameId)
            res.json({error: true, data: 'gameId not found'});

        let checkGame = await game.count({
            _id: gameId,
            winner: null,
            players: winner
        });
        
        if (!checkGame)
            res.json({error: true, data: 'game not found or invalid winner'});

        next();
    });
};
