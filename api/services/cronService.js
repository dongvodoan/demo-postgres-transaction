'use strict'

const schedule = require("node-schedule");

module.exports = {
    cronTransacionFails: () => {
        schedule.scheduleJob('*/1 * * * *', async () => {
            try {
               let transactions = await historyTransaction.find({
                   status: historyTransaction.status.fail 
                }).populate('gameType', 'app_id');
                console.log(`${transactions.length} transactions not completed!`);
                for (let i = 0; i < transactions.length; i++) {
                    let transaction = transactions[i];
                    let transactionId = transaction._id;
                    let user = transaction.user;
                    let amount = transaction.amount;
                    let method = transaction.method;
                    let app_id = transaction.gameType.app_id;
                    if (transaction.mothod === historyTransaction.methods.subtractCoin) {
                        let resDataSub = transactionRepository.postSubtractAmount(user, amount, app_id);
                        if (resDataSub.status === 200) {
                            await historyTransaction.findByIdAndUpdate({ _id: transactionId}, { $set: { status: 1 }});
                        }
                    } else if (transaction.mothod === historyTransaction.methods.addCoin) {
                        let resDataAdd = transactionRepository.postAddAmount(user, amount, app_id);
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
