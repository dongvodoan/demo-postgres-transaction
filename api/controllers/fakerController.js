'use strict';

const users = require('../data/userData');
const categories = require('../data/categoryData');

module.exports = {
    cleanAll: asyncWrap(async (req, res) => {
        let promise = await Promise.all([
            User.remove({}),
            Category.remove({}),
            Comment.remove({}),
            Like.remove({}),
            Post.remove({}),
            Report.remove({})
        ]);
        if (!promise)
            res.json({error: false, data: 'Clean All Database had been unsuccessfully!'});
        res.json({error: false, data: 'Clean All Database had been successfully!'});
    }),

    fakeData: asyncWrap(async (req, res) => {
        await User.create(users);
        await Category.create(categories);
        res.json({error: false, data: 'success'});
    })
};
