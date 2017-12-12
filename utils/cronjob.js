'use strict';

var CronJob = require('cron').CronJob;
var web3 = require('../config/constant').getWeb3();
var transaction = require('../api/controllers/transactionController');
var constant = require('../config/constant');
var User = require('../api/controllers/userController');

module.exports = {

    job: new CronJob({
        cronTime: '*/1 * * * *',
        onTick: function() {
            console.log("START CRON");
            transaction.getPendingTransaction(function(err, data){
                if(!err){
                    console.log(data.length);
                    for(var i =0; i< data.length; i++){

                        var hash = data[i].transactionHash;
                        console.log("database hash",hash, data[i].status);
                        //get transaction receipt
                        web3.eth.getTransactionReceipt(hash, function(err, receipt){
                            if(err != null){
                                transaction.updateTransaction(hash , 2, function(err, _data){
                                    if(err){
                                        console.log("failed", err);
                                    } else{
                                        console.log("cron not failed",_data.status);
                                    }
                                });
                                console.log("cron has error", err);
                            } else if(receipt != null) {
                                //
                                // console.log("status",data.status);
                                if (receipt.gasUsed <= constant.GAS_USED_TRANSFER) {
                                    //transaction failed
                                    transaction.updateTransaction(hash, 2, function (err, tx) {
                                        if (err) {
                                            console.log("has error");
                                        } else if (tx.from == constant.serverAddress) {
                                            //console.log("status",   tx.status);
                                            User.updateUserByAddress(tx.to, {
                                                $inc: {balance: tx.amount},
                                                updatedAt: new Date()
                                            }, function (err, user) {
                                                if (err) {
                                                    console.log("cron update user fails");
                                                } else{
                                                    console.log("cron update success withdraw fails", user.username);
                                                }
                                            });
                                        }
                                        console.log("cron job update success: ", receipt);
                                    });
                                } else {
                                    //transaction success
                                    transaction.updateTransaction(hash, 1, function (err, tx) {
                                        if (err) {
                                            console.log("has error");
                                        } else {
                                            //console.log("status",data.status);
                                            var user1 = tx.from;
                                            //from == server address: withdraw, balance user -= amount
                                            //from == use address: deposot, balance user += amount
                                            if (tx.to == constant.serverAddress) {
                                                //transaction deposit, send from user
                                                User.updateUserByAddress(user1, {
                                                    $inc: {balance: tx.amount},
                                                    updatedAt: new Date()
                                                }, function (err, user) {
                                                    if (err) {
                                                        console.log("update user cron deposit failed");
                                                    } else {
                                                        console.log("update user cron deposit success", user.username);
                                                    }
                                                });
                                            }
                                            //console.log("cron job update success", tx);
                                        }
                                    });
                                }
                            } else if(!constant.checkTransactionInPool(hash)) {
                                transaction.updateTransaction(hash , 2, function(err, data){
                                    if(err){
                                        console.log("failed", err);
                                    } else{
                                        console.log("cron not failed",hash);
                                    }
                                });

                            }

                        });


                    }
                }
            });
            console.log("END CRON");
        },

        start: false
    }),

    startJob: function(){
        this.job.start();
    },

    stopJob: function(){
        this.job.stop();
    }
}
