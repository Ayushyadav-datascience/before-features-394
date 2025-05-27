const { Client } = require('@googlemaps/google-maps-services-js');
const config = require('../config/services');

const mapsClient = new Client({});

class LocationService {
    // Get place details from Google Maps
    static async getPlaceDetails(placeId) {
        try {
            const response = await mapsClient.placeDetails({
                params: {
                    place_id: placeId,
                    key: config.googleMaps.apiKey,
                    fields: ['name', 'formatted_address', 'geometry', 'place_id']
                }
            });

            return response.data.result;
        } catch (error) {
            console.error('Error fetching place details:', error);
            throw error;
        }
    }

    // Search for places using Google Maps
    static async searchPlaces(query) {
        try {
            const response = await mapsClient.textSearch({
                params: {
                    query,
                    key: config.googleMaps.apiKey
                }
            });

            return response.data.results;
        } catch (error) {
            console.error('Error searching places:', error);
            throw error;
        }
    }

    // Get directions between two points
    static async getDirections(origin, destination) {
        try {
            const response = await mapsClient.directions({
                params: {
                    origin,
                    destination,
                    key: config.googleMaps.apiKey
                }
            });

            return response.data.routes[0];
        } catch (error) {
            console.error('Error getting directions:', error);
            throw error;
        }
    }

    // Get current location using browser's geolocation API
    static getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    // Calculate distance between two points
    static calculateDistance(point1, point2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(point2.lat - point1.lat);
        const dLon = this.toRad(point2.lng - point1.lng);
        const lat1 = this.toRad(point1.lat);
        const lat2 = this.toRad(point2.lat);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Convert degrees to radians
    static toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

module.exports = LocationService; 