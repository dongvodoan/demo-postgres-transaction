'use strict';

var constant = require('../config/constant');
var util = require('ethereumjs-util');
var keythereum = require('keythereum');
var Tx = require('ethereumjs-tx');
var web3 = constant.getWeb3();
var token = constant.getTokenInstance();



module.exports = {
    createNewWallet: function (password) {
		var params = { keyBytes: 32, ivBytes: 16 };
		var dk = keythereum.create(params);
		var privateKey = dk.privateKey;
		var options = {
			kdf: "pbkdf2",
			cipher: "aes-128-ctr",
			kdfparams: {
				c: 262144,
				dklen: 32,
				prf: "hmac-sha256"
			}
		};

		var keyObject = keythereum.dump(password, privateKey, dk.salt, dk.iv, options);
        var walletAddress = "0x" + keyObject.address;
        var keystore = JSON.stringify(keyObject);
        
        return {
            address: walletAddress,
            keystore: keystore
        }
	},


    constructNewTx: function (fromAddress, toAddress, amount, gasLimit, data, chainId) {
        var newTxParams = {
            nonce: "0x" + constant.getNonce().toString("16"),
            //gasPrice: "0x15a73b6200",
            gasPrice: "0x2E90EDD000",
           // gasLimit: "0x" + Number(11000).toString(16),
            gasLimit: "0x" + Number(gasLimit).toString(16),
            to: toAddress,
            value: "0x" + Number(web3.toWei(amount, "ether")).toString(16),
            data: data,
            chainId: chainId
        }
        constant.nonce++;
        console.log("raw tx: " + JSON.stringify(newTxParams));
        return newTxParams;
    },

    sendRawTransaction: function(rawData, cb){
        web3.eth.sendRawTransaction(rawData, function (err, txId) {
            console.log(err);
            console.log(txId);
            if (err === null) {
                cb(false, txId);
            } else {
                cb(err);
            }
        });
    },

	sendToken: function(to, amount, cb) {
        //var data =  token.transfer.getData(to, 10000000000);
        console.log(amount);
    	var data =  token.transfer.getData(to, amount);
		var rawTx = this.constructNewTx(constant.serverAddress,constant.tokenAddress, 0, 100000, data, 3);
		var tx = new Tx(rawTx);
		tx.sign(constant.privateKey);
        var serializedTx = tx.serialize();
        console.log(serializedTx.toString("hex"));
        this.sendRawTransaction('0x'+serializedTx.toString("hex"), cb);

    },

    listenerTransfer: function(cb) {
        token.Transfer("lastest").watch(function(err, event){
            console.log("transfer",event);
            cb(err, event);
        });
    },

    getETHBalance: function(address){
        return web3.fromWei(web3.eth.getBalance(address), "ether").toString();
    },

    getTokenBalance: function(address){
        return token.balanceOf.call(address).toNumber();
    }
}