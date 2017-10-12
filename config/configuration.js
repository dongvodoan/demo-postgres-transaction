'use strict';

module.exports = {
    port: 8000,
    secret: 'kbrserver',
    db_url: 'mongodb://bap:123456@ds149844.mlab.com:49844/kbr',
    FAUCET_AMOUNT: 5000, //  token
    FAUCET_TIME: 60 ,//  minute
    FAUCET_BALANCE: 1000, //  to faucet: balance <1000
    WITHDRAW_MIN: 1000,
    WITHDRAW_FEE: 100,
    TOKEN_SYMBOL: 'KBR'
}
