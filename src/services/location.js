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
    return true; // iOS handles permissions differently
  }

  // Get current location
  static getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('📍 Location captured:', latitude, longitude);
          resolve({ 
            latitude, 
            longitude,
            accuracy: position.coords.accuracy,
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
        distanceFilter: 10, // Update every 10 meters
        interval: 5000, 
        fastestInterval: 2000 
      }
    );
  }

  // Stop watching location
  static stopWatchingLocation(watchId) {
    Geolocation.clearWatch(watchId);
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