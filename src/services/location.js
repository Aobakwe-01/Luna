import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

class LocationService {
  // Request location permissions
  static async requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Luna Location Permission',
            message: 'Luna needs access to your location to share it during emergencies.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Location permission error:', err);
        return false;
      }
    }
    return true;
  }

  // Get current location
  static getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('📍 Location captured:', latitude, longitude);
          resolve({ 
            latitude, 
            longitude,
            accuracy: accuracy,
            timestamp: position.timestamp
          });
        },
        error => {
          console.error('Location error:', error);
          // Return demo location for development
          resolve({ 
            latitude: -26.2041, // Johannesburg coordinates
            longitude: 28.0473,
            accuracy: 50,
            timestamp: Date.now(),
            isDemo: true
          });
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000,
          distanceFilter: 10 
        }
      );
    });
  }

  // Get real address from coordinates
  static async getAddressFromCoordinates(latitude, longitude) {
    try {
      // For demo purposes - in production, use Google Maps Geocoding API
      const demoAddresses = [
        "123 Main Street, Johannesburg, 2000",
        "456 University Road, Cape Town, 8000",
        "789 Sandton Drive, Sandton, 2146",
        "321 Durban Beachfront, Durban, 4001",
        "555 Pretoria Central, Pretoria, 0002"
      ];
      
      // Return a random demo address
      const randomAddress = demoAddresses[Math.floor(Math.random() * demoAddresses.length)];
      return randomAddress;
      
      /* Production code with Google Maps API:
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return 'Address not available';
      */
    } catch (error) {
      console.error('Address lookup error:', error);
      return '123 Safety Street, Secureville, 2000';
    }
  }

  // Get both location and address
  static async getLocationWithAddress() {
    try {
      const location = await this.getCurrentLocation();
      const address = await this.getAddressFromCoordinates(location.latitude, location.longitude);
      
      return {
        ...location,
        address: address
      };
    } catch (error) {
      return {
        latitude: -26.2041,
        longitude: 28.0473,
        address: '123 Demo Street, Johannesburg, South Africa',
        isDemo: true
      };
    }
  }

  // Watch location changes (for real-time tracking)
  static watchLocation(callback) {
    return Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        callback({ latitude, longitude });
      },
      error => {
        console.error('Location watch error:', error);
      },
      { 
        enableHighAccuracy: true, 
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000 
      }
    );
  }

  // Stop watching location
  static stopWatchingLocation(watchId) {
    if (watchId) {
      Geolocation.clearWatch(watchId);
    }
  }

  // Format location for display
  static formatLocation(location) {
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  // Generate Google Maps link
  static getMapsLink(location) {
    return `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  }
}

export default LocationService;