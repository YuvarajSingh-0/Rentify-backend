const express = require('express');
const { authenticateToken } = require('../middlewares/isLoggedIn');
const { getIssuesByOwnerId, addIssue } = require('../controllers/issues.controller');
const isOwner = require('../middlewares/isOwner');
const isTenant = require('../middlewares/isTenant');
const { getPropertyByTenantId } = require('../controllers/properties.controller');
const router = express.Router();

router.get('/self', authenticateToken, isOwner, async(req, res) => {
    const issuesData=await getIssuesByOwnerId(req.params.ownerId);
    res.status(200).send(issuesData);
});

router.post('/new', authenticateToken,isTenant, async(req, res) => {
    const { title, description } = req.body;
    const property=await getPropertyByTenantId(req.userId);
    const issue = await addIssue({  title, description, propertyId:property.id});
    res.json(issue);
});

module.exports = router;