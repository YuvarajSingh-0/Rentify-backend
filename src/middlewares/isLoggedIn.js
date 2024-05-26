const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.userId = user.userId;
        req.role = user.role;
        next();
    });
}

module.exports = { authenticateToken };
