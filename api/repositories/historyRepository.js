'use strict'

module.exports = {
    createHistoryTransaction: async (user, amount, gameType, method, status = 1) => {
        try {
            let data = {
                user,
                amount,
                status,
                method,
                gameType
            }
            return await historyTransaction.create(data);
        } catch(error) {
            throw error;
        }
    }
};
