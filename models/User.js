const pool = require('../config/db');

class User {
    static async create({ username, email, phone, password }) {
        const result = await pool.query(
            'INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, phone, password]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findByPhone(phone) {
        const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        return result.rows[0];
    }

    //şimdilik üşendim gerisine yav aaaaaa
};

module.exports = User;