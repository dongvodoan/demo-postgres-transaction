/**
 * Email Service
 * @description Server-side logic for Email handle
 */

/**
 * Switch Email Adapter by environment
 */
let sendMail = require('./gmailService');

if (!sendMail) console.log('Not Found Email Adapter for EmailService');

module.exports = {

    /**
     * Example email
     * @param {object} user
     * @return {Promise}
     */
    sendWelcomeEmail: (user) => {
        let options = {
            to: user.email,
            from: 'admin@blog.vn',
            subject: 'Example email',
            html: `<h1>Welcome ${user.nickname} to Blog</h1>`
        };
        return sendMail(options);
    }
};
