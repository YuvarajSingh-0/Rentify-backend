const isOwner = async (req, res, next) => {
    // console.log(req.role);
    if (req.role !== 'SELLER') {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
}

module.exports = isOwner;