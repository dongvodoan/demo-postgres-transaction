'use strict';

module.exports = {
    port: 8002,
    secret: 'kbrserver',
    db_url: 'mongodb://localhost:27017/gameserver_kuberacoin',
    // db_url: 'mongodb://bap:123456@ds149844.mlab.com:49844/kbr',
    FAUCET_AMOUNT: 5000, //  token
    FAUCET_TIME: 60 ,//  minute
    FAUCET_BALANCE: 1000, //  to faucet: balance <1000
    WITHDRAW_MIN: 1000,
    WITHDRAW_FEE: 100,
    TOKEN_SYMBOL: 'KBR',
    BAPUri: "http://111.221.46.238:1341/api/v1/",
    BAPAppId: "1512462045734",
    BAPSecretKey: "1lcARf2LIIf8m11HXzyTaTOAH3kuwtZW",
    jwtSecret: 'SVhhTT1jZKbH1JbpQDv2',
    jwtExpiredIn: '7 days',
    env: 'staging'
};
