'use strict'

var Transaction = require('../models/transaction');

module.exports = {
    insertTransaction: function(txHash, _from, _to, _amount, _status) {
        Transaction.findOne({transactionHash: txHash}, function(err, data) {
           if(err != null){
               console.log("tx insert",err);
           } else if(data != null){
               console.log("tx insert exist");
           } else{
               var tx = new Transaction();
               tx.transactionHash = txHash;
               tx.from = _from;
               tx.to = _to;
               tx.amount = _amount;
               tx.status = _status;
               tx.createdAt = new Date();
               tx.updatedAt = new Date();

               tx.save(function(err, data) {
                   if(err != null){
                       console.log("insert tx err", err);
                   } else{
                        console.log("insert success",data);
                   }
               })
           }

        });
    },
    updateTransaction: function(txHash, _status, cb) {
        var $this = this;
        Transaction.findOneAndUpdate({
            transactionHash: txHash
        },{
            status: _status,
            updatedAt: new Date()
        },function (err, data) {
           if(err != null){
               console.log("update tx err",err);
               //check false if emit error
               cb(true, 1);
           } else if(data === null){
               console.log("update tx err: cant not find tx");
               cb(true, "cant find tx, data null");
           } else{
               cb(false, data);
           }
        });
    },

    //  get pending transaction
    getPendingTransaction: function(cb){
        Transaction.find({status : 0}, function(err, data) {
            //console.log(err);
            //console.log(""data);
            if (err || data.length == 0) {
                cb(true, null);
            } else {
                cb(false, data);
            }
        });
    },

    getAllTx: function(cb){
        Transaction.find({}, function(err,data){
            if(err){
                cb(true, err);
            } else {
                cb(false, data);
            }
        });
    },


}