const express = require('express');
const { authenticateToken } = require('../middlewares/isLoggedIn');
const { updateUser, getUser } = require('../controllers/users.constroller');
const router = express.Router();

router.get('/checkUserLoggedIn', authenticateToken, async (req, res) => {
    res.status(200).json({ message: 'User is logged in', role: req.role, userId: req.userId });
});

router.put('', authenticateToken, async (req, res) => {
    // Update user details
    const result=await updateUser(req.body, req.userId);
    res.status(200).json({ message: 'User updated', ...result });
}); 

router.get('', authenticateToken, async (req, res) => {
    const result = await getUser(req.userId);
    res.status(200).json(result);
});
module.exports = router;