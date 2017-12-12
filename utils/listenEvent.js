'use strict'

var Tx = require('../api/controllers/transactionController');
var wallet = require('./wallet');
var User = require('../api/controllers/userController');
var constant = require('../config/constant');
var transaction = require('../api/controllers/transactionController');

module.exports = {
    listenEvent: function() {
        wallet.listenerTransfer(function(err, event) {
            if(err != null){
                console.log("cant listen event");
            } else if(event === null){
                console.log("event null");
            } else{
                console.log("begin update");
                var remove = event.removed;
                var txHash = event.transactionHash;
                var amount = event.args.value.toNumber();
                //console.log(amount)
                if(!remove){
                    //transaction withdraw
                    if(event.args.from == constant.serverAddress){
                        var userAddress = event.args.to;
                        Tx.updateTransaction(txHash, 1, function(err, _data){
                            if(err && isNaN(_data)){
                                transaction.insertTransaction(txHash, constant.serverAddress, userAddress, amount, 1);
                                console.log("tx not send from server", err);
                            }
                            console.log("update tx db success", _data);
                        });
                    }

                    //transaction deposit
                    if(event.args.to == constant.serverAddress){
                        var userAddress = event.args.from;
                        Tx.updateTransaction(txHash, 1, function (err, _data) {
                            console.log(err, _data, !isNaN(_data), "update transaction");
                            if(err && isNaN(_data)){
                                console.log("tx not find from server");
                                User.updateUserByAddress(userAddress, {$inc: {balance: amount}, updatedAt: new Date()}, function (err, data) {
                                    if(err){
                                        console.log("failed update deposit event");
                                    } else{
                                        transaction.insertTransaction(txHash, userAddress, constant.serverAddress, amount, 1);
                                        console.log("success update deposit event", data);
                                    }
                                });

                            } else if(_data.status == 0){
                                User.updateUserByAddress(userAddress, {$inc: {balance: amount}, updatedAt: new Date()}, function (err, data) {
                                    if(err){
                                        console.log("failed update deposit event");
                                    } else{
                                        console.log("success update deposit event", data);

                                    }
                                });
                            };

                        });
                    }

                }

            }
            
        });
    }
}
