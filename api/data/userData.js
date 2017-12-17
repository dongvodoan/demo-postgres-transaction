'use strict'

const faker = require('faker');

module.exports = [{
    email: 'user@gmail.com',
    password: 'abc123',
    nickname: faker.internet.userName(),
    avatar: { 
        origin: faker.image.imageUrl(),
        thumb: faker.image.imageUrl()
    },
    gender: 0,
    phone: faker.phone.phoneNumber(),
    birthday: new Date(),
    role: 0,
}, {
    email: 'admin@gmail.com',
    password: 'abc123',
    nickname: faker.internet.userName(),
    avatar: { 
        origin: faker.image.imageUrl(),
        thumb: faker.image.imageUrl()
    },
    gender: 1,
    phone: faker.phone.phoneNumber(),
    birthday: new Date(),
    role: 1,
}];
