'use strict';

module.exports = {
    createUser: async(data) => {
        try {
            return await user.create(data);
        } catch (error) {
            throw error;
        }
    },
};
