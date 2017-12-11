"use strict";

const request = require("request");

const HttpService = {
    /**
     * Http get BAP Platform
     * @param uri
     * @param bearer_token
     * @return {Promise}
     */
    getPlatform: (uri, bearer_token) => {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'get',
                uri: uri,
                json: true
            };

            if (bearer_token)
                options.headers = {
                    'Authorization': 'Bearer ' + bearer_token
                };

            request.get(options, (error, response, body) => {
                if (error) reject(error);
                else resolve(body)
            })
        })
    },

    /**
     * Http post BAP Platform
     * @param uri
     * @param bearer_token
     * @param data
     * @return {Promise}
     */
    postPlatform: (uri, bearer_token, data) => {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'post',
                uri: uri,
                form: data,
                json: true
            };

            if (bearer_token)
                options.headers = {
                    'Authorization': 'Bearer ' + bearer_token
                };

            request.post(options, (error, response, body) => {
                if (error) reject(error);
                else resolve(body)
            })
        })
    },
};

module.exports = HttpService;
