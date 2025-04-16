const axios = require('axios');

const getLocationDetails = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status === 'OK') {
      const result = response.data.results[0];
      const addressComponents = result.address_components;
      
      // Extract relevant location details
      const location = {
        address: result.formatted_address,
        city: addressComponents.find(comp => comp.types.includes('locality'))?.long_name,
        state: addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name,
        country: addressComponents.find(comp => comp.types.includes('country'))?.long_name,
        postalCode: addressComponents.find(comp => comp.types.includes('postal_code'))?.long_name,
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      };

      return location;
    }

    throw new Error('Failed to get location details');
  } catch (error) {
    console.error('Error getting location details:', error);
    return {
      address: 'Location not available',
      coordinates: {
        lat: latitude,
        lng: longitude
      }
    };
  }
};

const validateCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

module.exports = {
  getLocationDetails,
  validateCoordinates
}; 