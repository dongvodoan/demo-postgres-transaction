'use strict';

module.exports = {
    /**
     * Get all users
     */
    getUsersForAdmin: asyncWrap(async (req, res) => {
        let users = await User.find({role: 0});
        res.json({error: false, data: users});
    }),

    getProfileMe: asyncWrap(async (req, res) => {
        let userId = req.user._id;
        let user = await User.findOne({_id: userId});
        res.json({error: false, data: user});
    })
}
