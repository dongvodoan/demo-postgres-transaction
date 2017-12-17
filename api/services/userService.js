'use strict'

const jwt = require("jsonwebtoken");

module.exports = {
    /**
     *
     * @param user
     * @return token
     */
    generateUserToken: (user) => {
        return jwt.sign(user, config.jwtSecret, {expiresIn: config.jwtExpiredIn});
    },

    jwtVerify: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.jwtSecret, (error, user) => {
                if (error) reject(error);
                else resolve(user._id);
            });
        })
    },
};
