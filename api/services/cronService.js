'use strict'

const schedule = require("node-schedule");

module.exports = {
    cronTransacionFails: () => {
        schedule.scheduleJob('*/1 * * * *', async () => {
            try {
               let transactions = await historyTransaction.find({
                   status: historyTransaction.status.fail 
                }).populate('gameType', 'appId');
                console.log(`${transactions.length} transactions not completed!`);
                for (let i = 0; i < transactions.length; i++) {
                    let transaction = transactions[i];
                    let transactionId = transaction._id;
                    let user = transaction.user;
                    let amount = transaction.amount;
                    let method = transaction.method;
                    let appId = transaction.gameType.appId;
                    if (transaction.mothod === historyTransaction.methods.subtractCoin) {
                        let resDataSub = transactionRepository.postSubtractAmount(user, amount, appId);
                        if (resDataSub.status === 200) {
                            await historyTransaction.findByIdAndUpdate({ _id: transactionId}, { $set: { status: 1 }});
                        }
                    } else if (transaction.mothod === historyTransaction.methods.addCoin) {
                        let resDataAdd = transactionRepository.postAddAmount(user, amount, appId);
                        if (resDataAdd.status === 200) {
                            await historyTransaction.findByIdAndUpdate({ _id: transactionId}, { $set: { status: 1 }});
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }
        });
    },
};
