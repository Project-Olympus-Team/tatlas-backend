const pool = require('../config/db');

class User {
    // Yeni kullanıcı oluşturma
    static async create({ username, email, phone, password }) {
        const result = await pool.query(
            'INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, phone, password]
        );
        return result.rows[0];
    }

    // Email ile kullanıcıyı bulma
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    // Telefon numarası ile kullanıcıyı bulma
    static async findByPhone(phone) {
        const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        return result.rows[0];
    }

    static async findOrCreateSocialUser({ googleId, facebookId, appleId, email, username }) {
        // user var mı bak bi la yeri
        let user = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR google_id = $2 OR facebook_id = $3 OR apple_id = $4',
            [email, googleId, facebookId, appleId]
        );

        if (user.rows[0]) return user.rows[0];

        // user yokmuş oluştur yeri
        user = await pool.query(
            'INSERT INTO users (username, email, google_id, facebook_id, apple_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, email, googleId, facebookId, appleId]
        );

        return user.rows[0];
    }


    //şimdilik üşendim gerisine yav aaaaaa
};

module.exports = User;