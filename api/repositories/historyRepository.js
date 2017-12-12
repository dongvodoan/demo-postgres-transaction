'use strict'

module.exports = {
    createHistoryTransaction: async (user, amount, method, status = 1) => {
        try {
            let data = {
                user,
                amount,
                status,
                method
            }
            return await historyTransaction.create(data);
        } catch(error) {
            throw error;
        }
    }
};
