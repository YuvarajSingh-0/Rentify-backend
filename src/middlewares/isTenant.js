const isTenant = async (req, res, next) => {
    if (req.role !== 'TENANT') {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
}

module.exports = isTenant;