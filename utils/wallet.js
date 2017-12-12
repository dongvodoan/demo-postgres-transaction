'use strict';

var constant = require('../config/constant');
var keythereum = require('keythereum');
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

    getETHBalance: function(address){
        return web3.fromWei(web3.eth.getBalance(address), "ether").toString();
    },

    getTokenBalance: function(address){
        return token.balanceOf.call(address).toNumber();
    }
}