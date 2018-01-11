'use strict';

const db = require('../../database');

module.exports = function(app){

    app.route('/api/v1/coins').get(asyncWrap(async(req, res) => {
        try {
            await db.query('BEGIN');

            const { rows } = await db.query('SELECT * FROM coins');
            res.json({data: rows});

            await db.query('COMMIT');
        } catch (err) {
            await db.query('ROLLBACK');
            throw err;
        } finally {
            db.release();
        }
    }));

    app.route('/api/v1/users').get(asyncWrap(async(req, res) => {
        try {
            await db.query('BEGIN');

            const { rows } = await db.query('SELECT * FROM USERS');
            res.json({data: rows});

            await db.query('COMMIT');
        } catch (err) {
            await db.query('ROLLBACK');
            throw err;
        } finally {
            db.release();
        }
    }));

    app.route('/api/v1/user/:id').get(asyncWrap(async(req, res) => {
        try {
            await db.query('BEGIN');

            let userId = req.params.id;
            const {rows} = await db.query('SELECT * FROM USERS WHERE id = $1', [userId]);
            res.json({data: rows[0]});

            await db.query('COMMIT');
        } catch (err) {
            await db.query('ROLLBACK');
            throw err;
        } finally {
            db.release();
        }
    }));

    app.route('/api/v1/user').post(asyncWrap(async(req, res) => {
        try {
            await db.query('BEGIN');

            let data = req.body;
            // console.log(data);
            // create new user
            const text1 = 'INSERT INTO users(name, age) VALUES($1, $2) RETURNING *';
            const values1 = [data.name, data.age];
            const {rows} = await db.query(text1, values1);
            // console.log(rows);

            // create user's point
            const text2 = 'INSERT INTO coins(userid, coin) VALUES($1, $2) RETURNING *';
            const values2 = [rows[0].id.s, 200];
            await db.query(text2, values2);

            res.json({data: 'success'});

            await db.query('COMMIT');
        } catch (err) {
            await db.query('ROLLBACK');
            throw err;
        } finally {
            db.release();
        }
    }));

    app.route('/api/v1/user/:id').put(asyncWrap(async(req, res) => {
        try {
            await db.query('BEGIN');

            let id = req.params.id;
            let data = req.body;
            const text = 'UPDATE users SET name = $1, age = $2 WHERE id = $3 RETURNING *';
            const values = [data.name, data.age, id];
            const {rows} = await db.query(text, values);
            res.json({data: rows[0]});

            await db.query('COMMIT');
        } catch (err) {
            throw err;
            await db.query('ROLLBACK');
        } finally {
            db.release();
        }
    }));

    app.route('/api/v1/user/:id').delete(asyncWrap(async(req, res) => {
        try {
            await db.query('BEGIN');

            let id = req.params.id;
            const text = 'DELETE FROM users WHERE id = $1 RETURNING *';
            const values = [id];
            const {rows} = await db.query(text, values);
            res.json({data: rows[0]});

            await db.query('COMMIT');
        } catch (err) {
            throw err;
            await db.query('ROLLBACK');
        } finally {
            db.release();
        }
    }));

    app.route('/api/v1/coin/:id').delete(asyncWrap(async(req, res) => {
        try {
            await db.query('BEGIN');

            let id = req.params.id;
            const text = 'DELETE FROM coins WHERE id = $1 RETURNING *';
            const values = [id];
            const {rows} = await db.query(text, values);
            res.json({data: rows[0]});

            await db.query('COMMIT');
        } catch (err) {
            throw err;
            await db.query('ROLLBACK');
        } finally {
            db.release();
        }
    }));
};
