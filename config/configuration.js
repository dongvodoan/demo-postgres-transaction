'use strict';

module.exports = {
    // port: 8000, // product
    port: 8002,    // staging
    secret: 'kbrserver',
    // db_url: 'mongodb://gameserver_kuberacoin:BIxeMEL5miVQ@localhost/gameserver_kuberacoin', // product
    db_url: 'mongodb://KBRSERVERSTAGING:SOh3TbYhx8ypJPxmt1oOfL@localhost/KBRSERVERSTAGING',    // staging
    // db_url: 'mongodb://bap:123456@ds149844.mlab.com:49844/kbr', // dev
    // db_url: 'mongodb://localhost:27017/kbr', // dev
    // BAPUri: "https://user.kuberacoin.com/api/v1/", // product
    BAPUri: "http://111.221.46.238:1341/api/v1/",     // staging
    jwtSecret: 'SVhhTT1jZKbH1JbpQDv2',
    jwtExpiredIn: '7 days',
    env: 'production', // product
    env: 'staging'     // staging
};
