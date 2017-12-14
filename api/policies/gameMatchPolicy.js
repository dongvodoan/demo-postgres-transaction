'use strict'

module.exports = function(app){
    app.post('/playgame', asyncWrap(async (req, res, next) => {
        const gameTypeId   = req.body.gameTypeId;
        const player1  = req.body.player1;
        const player2  = req.body.player2;
        const amount = req.body.amount;

        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        if (!gameTypeId)
            return res.json({error: true,data: 'gameTypeId is require', code: 422});
        if (!ObjectId.isValid(gameTypeId))
            return res.json({error: true, data: 'game type id null or malformed', code: 422});
        if (!player1)
            return res.json({error: true, data: 'player 1 is require', code: 422});
        if (!ObjectId.isValid(player1))
            return res.json({error: true, data: 'player 1 id null or malformed', code: 422});
        if (!player2) 
            return res.json({error: true, data: 'player 2 is require', code: 422});
        if (!ObjectId.isValid(player2))
            return res.json({error: true, data: 'player 2 id null or malformed', code: 422});
        
        if (!amount) {
            return res.json({error: true, data: 'amount is require', code: 422});
        } else if (isNaN(parseFloat(amount))) {
            return res.json({error: true, data: 'amount is not number', code: 422});
        }

        if (player1 === player2)
            return res.json({error: true, data: 'Can not play with yourself', code: 422});

        let promise = await Promise.all([
            gametype.count({_id: gameTypeId}),
            user.count({_id: player1}),
            user.count({_id: player2}),
            userRepository.getDepositBalanceByUser(player1),
            userRepository.getDepositBalanceByUser(player2)
        ]);

        if (!promise[0])
            return res.json({error: true, data: 'game type not found', code: 404});

        if (!promise[1]) 
            return res.json({error: true, data: 'player 1 not found', code: 404});  
        
        if (!promise[2]) 
            return res.json({error: true, data: 'player 2 not found', code: 404}); 

        if (promise[3] < amount)
            return res.json({error: true, data: 'player 1 enough coin', code: 400});

        if (promise[4] < amount)
            return res.json({error: true, data: 'player 2 enough coin', code: 400});
         
        next();
    }));

    app.post('/endgame', async (req, res, next) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;

        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        if (!winner)
            return res.json({error: true, data: 'winner is require', code: 422});
        if (!ObjectId.isValid(gameId))
            return res.json({error: true,data: 'game id null or malformed', code: 422});
        if (!gameId)
            return res.json({error: true, data: 'gameId is require', code: 422});
        if (!ObjectId.isValid(winner))
            return res.json({error: true,data: 'winner id null or malformed', code: 422});

        let checkGame = await game.count({
            _id: gameId,
            winner: null, 
            $or: [{player1: winner}, {player2: winner}]
        });
        
        if (!checkGame)
            return res.json({error: true, data: 'game not found or invalid winner', code: 400});

        if (!await user.count({_id: winner}))
            return res.json({error: true, data: 'winner not found', code: 404});

        next();
    });

    app.get('/get-history/:id', (req, res, next) => {
        if(!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            return res.json({error: true, data: 'user id is require', code: 422});
        if (!ObjectId.isValid(req.params.id))
            return res.json({error: true, data: 'user id null or malformed', code: 422});
        next();
    });

    app.get('/get-gameinfo/:id', (req, res, next) => {
        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        if (!req.params.id)
            return res.json({error: true, data: 'user id is require', code: 422});
        if (!ObjectId.isValid(req.params.id))
            return res.json({error: true, data: 'user id null or malformed', code: 422});
        next();
    });

    app.post('/playgame2', async (req, res, next) => {
        const gameTypeId   = req.body.gameTypeId;
        let players  = req.body.players.split(",");
        const amount = req.body.amount;

        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401}); 
        if (!gameTypeId)
            return res.json({error: true, data: 'game type id is require', code: 422});
        if (!ObjectId.isValid(gameTypeId))
            return res.json({error: true, data: 'game type id null or malformed', code: 422});
        if (!await gametype.count({_id: gameTypeId}))
            return res.json({error: true, data: 'game type not found', code: 404});
        if (!players)
            return res.json({error: true, data: 'players is require', code: 422});
        
        if (!Array.isArray(players) || players.length < 2)
            return res.json({error: true, data: 'Incorrect players', code: 422});
        
        if(!amount){
            return res.json({error: true, data: 'amount is require', code: 422});
        } else if(isNaN(parseFloat(amount))){
            return res.json({error: true, data: 'amount is not number', code: 422});
        }

        for (let i = 1; i <= players.length; i++){
            let player = players[i];
            if (!ObjectId.isValid(player))
                return res.json({error: true, data: `player ${i} id null or malformed`, code: 422});
            if (!await user.count({_id: player}))
                return res.json({error: true, data: `player ${i} not found`, code: 404});
            if (await userRepository.getDepositBalanceByUser(player) < amount)
                return res.json({error: true, data: `player ${i} enough coin`, code: 400});
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
            return res.json({error: true, data: 'Can not play with yourself', code: 422});

        next();
    });

    app.post('/endgame2', async (req, res, next) => {
        const gameId = req.body.gameId;
        const winner = req.body.winner;

        if (!req.user)
            return res.json({error: true, data: 'unauthorized', code: 401});
        if (!winner)
            return res.json({error: true, data: 'winner is require', code: 422});
        if (!ObjectId.isValid(winner))
            return res.json({error: true, data: 'winner id null or malformed', code: 422});
        if (!await user.count({_id: winner}))
            return res.json({error: true, data: 'winner not found', code: 404});
        if (!gameId)
            return res.json({error: true, data: 'game id not found'});
        if (!ObjectId.isValid(gameId))
            return res.json({error: true, data: 'game id null or malformed', code: 422});

        let checkGame = await game.count({
            _id: gameId,
            winner: null,
            players: winner
        });
        
        if (!checkGame)
            return res.json({error: true, data: 'game not found or invalid winner', code: 400});
        if (!await user.count({_id: winner}))
            return res.json({error: true, data: 'winner not found', code: 404});

        next();
    });
};
