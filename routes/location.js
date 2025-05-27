const express = require('express');
const router = express.Router();
const LocationService = require('../utils/locationService');
const { isAuthenticated } = require('../middleware/googleAuth');

// Get place details
router.get('/place/:placeId', isAuthenticated, async (req, res) => {
    try {
        const placeDetails = await LocationService.getPlaceDetails(req.params.placeId);
        res.json(placeDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching place details', error: error.message });
    }
});

// Search places
router.get('/search', isAuthenticated, async (req, res) => {
    try {
        const { query } = req.query;
        const places = await LocationService.searchPlaces(query);
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: 'Error searching places', error: error.message });
    }
});

// Get directions
router.get('/directions', isAuthenticated, async (req, res) => {
    try {
        const { origin, destination } = req.query;
        const directions = await LocationService.getDirections(origin, destination);
        res.json(directions);
    } catch (error) {
        res.status(500).json({ message: 'Error getting directions', error: error.message });
    }
});

// Get current location
router.get('/current', isAuthenticated, async (req, res) => {
    try {
        const location = await LocationService.getCurrentLocation();
        res.json(location);
    } catch (error) {
        res.status(500).json({ message: 'Error getting current location', error: error.message });
    }
});

// Calculate distance between two points
router.post('/distance', isAuthenticated, async (req, res) => {
    try {
        const { point1, point2 } = req.body;
        const distance = LocationService.calculateDistance(point1, point2);
        res.json({ distance });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating distance', error: error.message });
    }
});

module.exports = router; 