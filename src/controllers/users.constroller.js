const prisma = require('../prisma');    
const getUser = async (userId) => {
    const user = await prisma.usersInfo.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            role: true,
            contact: true,
            name: true,
        }
    });
    return user;
}

const updateUser = async (data, userId) => {
    const { email, contact, name } = data;
    const user = await prisma.usersInfo.update({
        where: {
            id: userId,
        },
        data: {
            email,
            contact,
            name,
        },
        select: {
            id: true,
            email: true,
            role: true,
            contact: true,
            name: true,
        }
    });
    return user;
}

module.exports = { getUser, updateUser };