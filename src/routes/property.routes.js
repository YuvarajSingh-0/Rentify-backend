const express = require('express');
const { authenticateToken } = require('../middlewares/isLoggedIn');
const { addProperty, fetchProperties, fetchPropertyById, fetchPropertiesByOwner, updateProperty, deleteProperty, handleMailSend } = require('../controllers/properties.controller');
const isOwner = require('../middlewares/isOwner');
const { getUser } = require('../controllers/users.constroller');

const router = express.Router();

// Add a new property
router.post('/new', authenticateToken, async (req, res) => {
    const { property_name, description, city, location, price, amenities, images, area, nearbyMetros, nearbySchools, nearbyHospitals, metroDistance, schoolDistance, hospitalDistance } = req.body;
    // console.log("req.body", req.userId)
    const property = await addProperty({ ownerId: req.userId, name: property_name, location, description, city, price, amenities, images, area, nearbyMetros, nearbySchools, nearbyHospitals, schoolDistance, hospitalDistance, metroDistance });
    res.json(property);
});

router.get('/self', authenticateToken, isOwner, async (req, res) => {
    // console.log("in self",req.query)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const sort = req.query.sort || '';
    const order = req.query.order || '';
    const metroDistance=parseInt(req.query.metroDistance) || 0;
    const schoolDistance=parseInt(req.query.schoolDistance) || 0;
    const hospitalDistance=parseInt(req.query.hospitalDistance) || 0;
    const minPrice=parseInt(req.query.minPrice) || 0;
    const maxPrice=parseInt(req.query.maxPrice) || 0;
    const properties = await fetchPropertiesByOwner(req.userId, { page, limit, search, sort, order, minPrice, maxPrice, schoolDistance, hospitalDistance, metroDistance });
    // console.log("bef res",properties)
    res.json(properties);
});

// Fetch all properties
// Fetch all properties with pagination
router.get('/all', async (req, res) => {
    // console.log("in all",req.query)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const sort = req.query.sort || '';
    const order = req.query.order || '';
    const metroDistance = req.query.metroDistance || 0;
    const schoolDistance = req.query.schoolDistance || 0;
    const hospitalDistance = req.query.hospitalDistance || 0;
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 0;
    const result = await fetchProperties({ page, limit, search, sort, order, metroDistance, schoolDistance, hospitalDistance, minPrice, maxPrice });
    res.json(result);
});

router.post('/:id/interest', authenticateToken, async (req, res) => {
    const property = await fetchPropertyById(req.params.id);
    const user = await getUser(req.userId);
    if (!property) {
        return res.status(404).json({ error: 'Property not found' });
    }
    const mail_id = await handleMailSend(property.owner.email, user, property);
    res.json({ message: 'Interest shown' });
});

router.get('/:id', async (req, res) => {
    const property = await fetchPropertyById(req.params.id);
    // console.log(property)
    if (property) {
        res.status(200).json(property);
    }
    else {
        res.status(404).json({ error: 'Property not found' });
    }
});

router.put('/update', authenticateToken, isOwner, async (req, res) => {
    const property = await updateProperty(req.body);
    res.status(200).json({ message: 'Property updated', ...property });
});

router.delete('/delete', authenticateToken, isOwner, async (req, res) => {
    try {
        // console.log(req.body)
        const result = await deleteProperty(propertyId = req.body.id, ownerId = req.userId);
        // console.log(result)
        res.status(204).json({ message: 'Property deleted' });
    } catch (e) {
        console.log(e)
        return res.status(404).json({ error: e.message });
    }
});

module.exports = router;