'use strict';

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var config = require('../../config/configuration');
var wallet = require('../../utils/wallet');
var transaction = require('../controllers/transactionController');
var constant  = require('../../config/constant');

module.exports = {
    insertUser: function(username, password, cb){
        User.findOne({'username': username}, function(err, data){
            if(err != null){
                cb(true, err);
            } else if(data != null){
                cb(true, 'The user exists');
            } else {
                var newWallet = wallet.createNewWallet(password);
                var user = new User();
                user.username = username;
                user.password = user.generateHash(password);
                user.address = newWallet.address;
                user.keystore = newWallet.keystore;
                user.balance = config.FAUCET_AMOUNT;
                user.createdAt = new Date();
                user.updatedAt = new Date();
                user.faucetedAt = new Date();
        
                user.save(function(err, data){
                    if(err != null){
                        cb(true, err);
                    } else {
                        cb(false, data);
                    }
                });
            }
        });
    },
    login: function(username, password, cb){
        User.findOne({'username': username}, function(err, data){
            if(err != null){
                cb(true, err);
            } else if(data === null) {
                cb(true, 'User not found');
            } else {
                if(!data.validPassword(password)){
                    cb(true, 'Password incorrect');
                } else if(data.keystore === null){
                    var newWallet = wallet.createNewWallet(password);
                    User.findByIdAndUpdate(data._id, {
                        address: newWallet.address,
                        keystore: newWallet.keystore,
                        updatedAt: new Date()
                    }, {
                        new : true
                    }, function(err, data){
                        if(err){
                            cb(true, err);
                        } else {
                            cb(false, data);
                        }
                    });
                }else {
                    cb(false, data);
                }
            }
        });
    },
    getAllUser: function(cb){
        User.find({}, function(err,data){
            if(err){
                cb(true, err);
            } else {
                cb(false, data);
            }
        });
    },
    faucet: function(user_id, cb){
        var $this = this;
        User.findById(user_id, function(err, data){
            if(err != null){
                cb(true, err);
            } else if (data === null){
                cb(true, 'User not found');
            } else if(data.keystore == null){
                cb(true, 'Wallet not found');
            } else if(data.balance >= config.FAUCET_BALANCE){
                cb(true, 'Require balance < ' + config.FAUCET_BALANCE + ' ' +config.TOKEN_SYMBOL);
            }else {
                var faucetedAt = data.faucetedAt;
                if(faucetedAt == null){
                    data.faucetedAt = new Date();
                    data.balance += config.FAUCET_AMOUNT;
                    data.updatedAt = new Date();
                    $this.updateUserById(user_id, data, cb);
                } else{
                    var diff = Math.abs(data.faucetedAt - new Date());
                    var minutes = Math.floor((diff/1000)/60);
                    if(minutes < config.FAUCET_TIME){
                        cb(true, 'Waiting ' + (config.FAUCET_TIME - minutes) + ' minutes to faucet');
                    } else {
                        data.faucetedAt = new Date();
                        data.balance += config.FAUCET_AMOUNT;
                        data.updatedAt = new Date();
                        $this.updateUserById(user_id, data, cb);
                    }
                }
            }
        });
    },
    createWallet: function(user_id, password, cb){
        var $this = this;
        User.findById(user_id, function(err, data){
            if(err){
                cb(true, err);
            } else if(data === null) {
                cb(true, 'User not found');
            } else if(data.keystore != null){
                cb(true, 'Wallet already exists');
            } else {
                var newWallet = wallet.createNewWallet(password);
                var data = {
                    address: newWallet.address,
                    keystore: newWallet.keystore,
                    updatedAt: new Date()
                }
                User.findByIdAndUpdate(user_id, data, function(err, user){
                    if(err){
                        cb(true, err);
                    } else {
                        cb(false, data);
                    }
                });
            }
        });
    },
    updateUserById: function(id, data, cb){
        User.findByIdAndUpdate(id, data, {new : true}, function(err, user){
            if(err){
                cb(true, err);
            } else {
                cb(false, user);
            }
        });
    },

    withdraw: function(id, amount, cb) {
        var $this = this;
        User.findById(id, function(err, data){
            if(err != null){
                cb(true, err);
            } else if (data === null){
                cb(true, 'User not found');
            } else {
                var userAddress = data.address;
                var balance = data.balance;
                //console.log(userAddress);
                //console.log(balance);
                if(balance >= amount){
                    console.log("IM HERE");
                    //data.balance -= amount;
                    $this.updateUserByAddress(userAddress, {$inc: {balance: -amount}}, function (err, user) {
                       if(err){
                           console.log("has error when update withdraw");
                           cb(true, err);
                       } else{
                           console.log(user);
                            wallet.sendToken(userAddress, amount - config.WITHDRAW_FEE, function(err, txId) {
                                if(err){
                                    cb(true, err);
                                } else {
                                    transaction.insertTransaction(txId, constant.serverAddress, userAddress, amount, 0);
                                    cb(false, txId);
                                }
                            });
                       }
                    });
                } else{
                    cb(false, "not enough balance");
                }
            }
        });
    },

    depoisit: function (id, amount, rawData, cb){
        //var $this = this;
        User.findById(id, function(err, data){
            if(err != null){
                cb(true, err);
            } else if (data === null){
                cb(true, 'User not found');
            } else {
                var useAddress = data.address;
                wallet.sendRawTransaction(rawData, function(err, txId){
                    if(err){
                        cb(true, err);
                    } else{
                        transaction.insertTransaction(txId, useAddress, constant.serverAddress, amount, 0);
                        cb(false, txId);
                    }
                });
            }
        });
    },

    findUserByAddress: function(address, cb){
        User.findOne({address: address}, function(err, user){
            if(err){
                cb(true, err);
            } else {
                console.log(user);
                cb(false, user);
            }
        });
    },

    updateUserByAddress: function(address, data, cb) {
        //console.log("update user by address");
        User.findOneAndUpdate({address: address}, data, function(err, user) {
            if(err != null){
                cb(true, err);
            } else if(user == null){
                cb(true, "user not exist");
            } else{
                cb(false, user);
            }
        });
    },

    getToken: function(user_id,cb){
        User.findById(user_id, function(err, data){
            if(err){
                cb(true, err);
            } else if(data === null){
                cb(true, 'User not found');
            } else {
                cb(false, data.balance, data._id);
            }
        });
    },

    getUserInfo: function(user_id, cb){
        User.findById(user_id).lean().exec(function(err, data){
            if(err){
                cb(true, err);
            } else if(data === null){
                cb(true, 'User not found');
            } else {
                var kbr = wallet.getTokenBalance(data.address) + ' KBR';
                var eth = wallet.getETHBalance(data.address) + ' ETH';
                data.eth = eth;
                data.kbr = kbr;
                cb(false, data);
            }
        });
    }
}
