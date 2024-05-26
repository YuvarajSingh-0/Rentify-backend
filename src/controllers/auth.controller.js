const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const loginUser = async (data) => {
    const { email } = data;
    const originalPassword = data.password;
    try {
        if (!email || !originalPassword) {
            return { error: 'Invalid username or password' };
        }
        const user = await prisma.usersInfo.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive', // Default value: default
                },
            },
        });
        // console.log(user)
        if (!user) {
            return { error: 'Invalid username or password' };
        }
        const passwordMatch = await bcrypt.compare(originalPassword, user.password);
        if (!passwordMatch) {
            return { error: 'Invalid username or password' };
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { token };
    } catch (e) {
        console.log(e);
        return { error: e.message };
    }
}

const registerUser = async (data) => {
    const { email, password, role, contact, name } = data;
    // console.log(data)
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.usersInfo.create({
            data: {
                email,
                password: hashedPassword,
                role,
                contact,
                name,
            },
            select: {
                id: true,
                email: true,
                role: true,
                contact: true,
                name: true,
            },
        });
        return user;
    } catch (e) {
        console.error(e);
        return { error: e.message };
    }
}

module.exports = { loginUser, registerUser };