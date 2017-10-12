'use strict';

var Web3 = require('web3');

module.exports = {
    tokenAddress: "0xb80db791a23b114d93ef0c6d2c20214235da9cb0",
    tokenABI: [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"burn","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"game","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"gameAddress","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToGames","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Burned","type":"event"}],
    url: "https://api.myetherapi.com/rop",
    //url: "http://118.69.187.7:8545",
    //url: "https://ropsten.infura.io/Nn8DngG5kgrp2DDk4QFL",
    serverAddress: "0xdb526bedb534cca762abf049d56c8a103d8dfa95",
    privateKey: new Buffer('8f8ba8da1609f343a549d221bb76b95ac0c8a48411f509db6f2c32cb28627d9a', 'hex'),
    GAS_USED_TRANSFER: 36759,
    //GAS_USED_TRANSFERFROM: 0,
    nonce: 1556,


    getNonce: function () {
        var _nonce = this.getWeb3().eth.getTransactionCount(this.serverAddress);
        if(_nonce > this.nonce){
            this.nonce = _nonce;
        }
        return this.nonce;
    },

    getWeb3: function(){
        return  new Web3(new Web3.providers.HttpProvider(this.url));
    },
    
    getTokenInstance: function () {
        var token = this.getWeb3().eth.contract(this.tokenABI);
        return token.at(this.tokenAddress);
    },

    checkTransactionInPool: function (_txHash) {
        return (this.getWeb3().eth.getBlock("pending").transactions.includes(_txHash));

    }
}