import { auth } from './firebase';
import LocationService from './location'; 

class TripService {
  static activeTrips = new Map(); // In-memory storage for demo

  // Start a new trip
  static async startTrip(destination, duration, contacts) {
    try {
      const user = auth().currentUser;
      const startLocation = await LocationService.getLocationWithAddress();
      
      const tripData = {
        userId: user?.uid || 'demo-user',
        userName: user?.email || 'Demo User',
        destination: destination,
        estimatedDuration: parseInt(duration),
        startTime: new Date(),
        startLocation: startLocation,
        contacts: contacts,
        status: 'active',
        checkInRequired: true,
        currentLocation: startLocation,
        lastUpdated: new Date()
      };

      const tripId = 'trip_' + Date.now();
      this.activeTrips.set(tripId, {
        ...tripData,
        id: tripId,
        watchId: null
      });

      // Start location tracking
      const watchId = LocationService.watchLocation(async (location) => {
        await this.updateTripLocation(tripId, location);
      });

      // Update trip with watch ID
      const trip = this.activeTrips.get(tripId);
      this.activeTrips.set(tripId, { ...trip, watchId });

      console.log('🚗 Trip started:', tripData);
      
      // Notify contacts (in demo, just log it)
      this.notifyContacts(tripId, 'start');
      
      return { 
        success: true, 
        tripId: tripId, 
        watchId: watchId,
        startLocation: startLocation 
      };
    } catch (error) {
      console.error('Error starting trip:', error);
      return { success: false, error: error.message };
    }
  }

  // Update trip location in real-time
  static async updateTripLocation(tripId, location) {
    try {
      const trip = this.activeTrips.get(tripId);
      if (!trip) return;

      const address = await LocationService.getAddressFromCoordinates(location.latitude, location.longitude);
      
      const updatedTrip = {
        ...trip,
        currentLocation: { ...location, address },
        lastUpdated: new Date()
      };

      this.activeTrips.set(tripId, updatedTrip);
      
      console.log('📍 Trip location updated:', {
        tripId,
        location: `${location.latitude}, ${location.longitude}`,
        address: address
      });

    } catch (error) {
      console.error('Error updating trip location:', error);
    }
  }

  // Complete trip and send arrival notification
  static async completeTrip(tripId) {
    try {
      const trip = this.activeTrips.get(tripId);
      if (!trip) return { success: false, error: 'Trip not found' };

      const endLocation = await LocationService.getLocationWithAddress();
      
      // Stop location tracking
      if (trip.watchId) {
        LocationService.stopWatchingLocation(trip.watchId);
      }

      const completedTrip = {
        ...trip,
        status: 'completed',
        endTime: new Date(),
        endLocation: endLocation,
        arrivedSafely: true
      };

      this.activeTrips.set(tripId, completedTrip);

      // Notify contacts about safe arrival
      await this.notifyContacts(tripId, 'arrival');

      return { success: true, endLocation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Notify emergency contacts
  static async notifyContacts(tripId, type) {
    try {
      const trip = this.activeTrips.get(tripId);
      if (!trip) return;

      const contacts = trip.contacts || [];
      
      if (type === 'start') {
        console.log(`🔔 TRIP START notified to ${contacts.length} contacts:`);
        console.log(`   Destination: ${trip.destination}`);
        console.log(`   Started from: ${trip.startLocation.address}`);
        console.log(`   ETA: ${trip.estimatedDuration} minutes`);
        console.log(`   Contacts:`, contacts.map(c => c.name));
        
      } else if (type === 'arrival') {
        console.log(`✅ SAFE ARRIVAL notified to ${contacts.length} contacts:`);
        console.log(`   Arrived at: ${trip.endLocation.address}`);
        console.log(`   Destination: ${trip.destination}`);
        console.log(`   Contacts:`, contacts.map(c => c.name));
      }

      return { success: true };
    } catch (error) {
      console.error('Error notifying contacts:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancel trip
  static async cancelTrip(tripId) {
    try {
      const trip = this.activeTrips.get(tripId);
      if (!trip) return { success: false, error: 'Trip not found' };

      // Stop location tracking
      if (trip.watchId) {
        LocationService.stopWatchingLocation(trip.watchId);
      }

      this.activeTrips.delete(tripId);
      
      console.log('❌ Trip cancelled:', tripId);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get active trip
  static getActiveTrip(tripId) {
    return this.activeTrips.get(tripId);
  }
}

export default TripService;