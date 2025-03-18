const jwt = require('jsonwebtoken');
// Auth middleware'ı (doğrulama kontrolü) 
const auth = (req, res, next) => {
    try {
        // Authorization başlığındaki token'ı almak
        const token = req.headers.authorization.split(' ')[1]; // Authorization header'ından 'Bearer <token>' şeklinde gelen token'ı ayırıyoruz

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Authentication failed" });
    }
};

module.exports = auth;