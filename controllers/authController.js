const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Validate required fields: Ensure username, password, and either email or phone are provided
        if (!username || !password || (!email && !phone)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if the user already exists in database by username, email, phone
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2 OR phone = $3',
            [username, email, phone]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        };

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user via the User model
        const newUser = await User.create({ username, email, phone, password: hashedPassword });

        // Assign token (30 days expiry)
        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
                created_at: newUser.created_at
            },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
};

const login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // Ensure only one of email or phone is provided
        if ((!email && !phone) || (email && phone)) {
            return res.status(400).json({ error: 'Provide email OR phone' });
        }

        // Get the user via the model's methods
        let user;
        if (email) {
            user = await User.findByEmail(email);
        } else {
            user = await User.findByPhone(phone);
        }

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Create a token for the user after login
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({ 
            message: "Login successful",
            token 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed. Please try again" });
    }
};

module.exports = {
    register,
    login
};