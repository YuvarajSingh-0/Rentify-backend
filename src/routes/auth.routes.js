const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/auth.controller');


router.post('/register', async (req, res) => {
    const result = await registerUser(req.body);
    if (result.error) {
        return res.status(400).json(result);
    }
    res.status(201).json({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
    // console.log(req.body)
    const result = await loginUser(req.body);
    if (result.error) {
        return res.status(400).json(result);
    }
    res.cookie('token', result.token, {
        httpOnly: true, // Ensures the cookie is only accessible by the server
        secure: true,   // Ensures the cookie is only sent over HTTPS
        sameSite: 'strict' // Prevents CSRF attacks by restricting cookie to same-site requests
    });
    res.status(200).json({ message: 'Login successful', ...result });
});

router.post('/logout', async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
});



module.exports = router;
