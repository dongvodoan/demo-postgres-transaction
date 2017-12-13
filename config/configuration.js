'use strict';

module.exports = {
    port: 8002,
    secret: 'kbrserver',
    db_url: 'mongodb://KBRSERVERSTAGING:SOh3TbYhx8ypJPxmt1oOfL@localhost/KBRSERVERSTAGING',
    // db_url: 'mongodb://bap:123456@ds149844.mlab.com:49844/kbr',
    // db_url: 'mongodb://localhost:27017/kbr',
    BAPUri: "http://111.221.46.238:1341/api/v1/",
    BAPSecretKey: "1lcARf2LIIf8m11HXzyTaTOAH3kuwtZW",
    jwtSecret: 'SVhhTT1jZKbH1JbpQDv2',
    jwtExpiredIn: '7 days',
    env: 'staging'
};
