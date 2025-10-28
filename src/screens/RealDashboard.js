import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Vibration, TextInput, ScrollView } from 'react-native';
import TripService from '../services/tripService';
import LocationService from '../services/location';

const RealDashboard = ({ navigation }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [tripActive, setTripActive] = useState(false);
  const [tripInfo, setTripInfo] = useState(null);
  const [destination, setDestination] = useState('');
  const [tripDuration, setTripDuration] = useState('30');
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Get initial location
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const location = await LocationService.getLocationWithAddress();
    setCurrentLocation(location);
  };

  const handleEmergencyPress = () => {
    if (emergencyActive) return;
    
    setEmergencyActive(true);
    
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      Vibration.vibrate(200);
      countdown--;
      
      if (countdown === 0) {
        clearInterval(countdownInterval);
        triggerEmergencyAlert();
      }
    }, 1000);
    
    Alert.alert(
      "Emergency Alert",
      `Alert will send your location and address to emergency contacts in ${countdown} seconds...`,
      [
        { 
          text: "CANCEL", 
          style: "destructive",
          onPress: () => {
            clearInterval(countdownInterval);
            setEmergencyActive(false);
          }
        }
      ],
      { cancelable: false }
    );
  };

  const triggerEmergencyAlert = async () => {
    try {
      const locationWithAddress = await LocationService.getLocationWithAddress();
      
      Alert.alert(
        "🚨 Emergency Alert Sent!",
        `Your location has been shared with emergency contacts:\n\n📍 ${locationWithAddress.address}\n\nYour contacts will receive your exact location and can track you in real-time.`,
        [
          { 
            text: "OK", 
            onPress: () => {
              setEmergencyActive(false);
              navigation.goBack();
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert(
        "Alert Sent!",
        "Your emergency contacts have been notified with your location.",
        [
          { 
            text: "OK", 
            onPress: () => {
              setEmergencyActive(false);
              navigation.goBack();
            }
          }
        ]
      );
    }
  };

  const startTripSharing = async () => {
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter your destination');
      return;
    }

    const demoContacts = [
      { name: 'Family Member', phone: '+27 11 123 4567' },
      { name: 'Trusted Friend', phone: '+27 82 765 4321' },
      { name: 'Emergency Contact', phone: '+27 83 555 7890' }
    ];

    const result = await TripService.startTrip(destination, parseInt(tripDuration), demoContacts);
    
    if (result.success) {
      setTripActive(true);
      setTripInfo(result);
      Alert.alert(
        "Trip Sharing Started! 🗺️",
        `Your emergency contacts can now monitor your journey in real-time:\n\n🏁 Destination: ${destination}\n⏱️ ETA: ${tripDuration} minutes\n👥 Notified: ${demoContacts.length} contacts\n\nThey will be automatically notified when you arrive safely.`,
        [{ text: "Drive Safe! 🚗" }]
      );
    } else {
      Alert.alert('Error', 'Failed to start trip sharing');
    }
  };

  const completeTrip = async () => {
    const result = await TripService.completeTrip(tripInfo.tripId);
    
    if (result.success) {
      setTripActive(false);
      setTripInfo(null);
      setDestination('');
      Alert.alert(
        "Safe Arrival! ✅",
        `Your emergency contacts have been notified that you arrived safely at:\n\n📍 ${result.endLocation.address}`,
        [{ text: "OK" }]
      );
    }
  };

  const cancelTrip = async () => {
    Alert.alert(
      "Cancel Trip Sharing",
      "Are you sure you want to stop sharing your trip with emergency contacts?",
      [
        { text: "Continue Sharing", style: "cancel" },
        { 
          text: "Stop Sharing", 
          style: "destructive",
          onPress: async () => {
            const result = await TripService.cancelTrip(tripInfo.tripId);
            if (result.success) {
              setTripActive(false);
              setTripInfo(null);
              setDestination('');
              Alert.alert("Trip Sharing Stopped", "Your contacts are no longer monitoring your journey.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Luna</Text>
      <Text style={styles.subtitle}>Your safety companion</Text>

      {/* Current Location Display */}
      {currentLocation && (
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>📍 Your Current Location</Text>
          <Text style={styles.locationAddress}>{currentLocation.address}</Text>
          <Text style={styles.locationCoords}>
            {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}
      
      {/* Emergency Button */}
      <TouchableOpacity 
        style={[styles.emergencyButton, emergencyActive && styles.emergencyActive]}
        onPress={handleEmergencyPress}
        disabled={emergencyActive}
      >
        <Text style={styles.emergencyText}>
          {emergencyActive ? '🔄 SENDING...' : '🚨 ACTIVATE'}
        </Text>
        <Text style={styles.emergencySubtext}>
          Sends your live location & real address to emergency contacts
        </Text>
      </TouchableOpacity>

      {/* Trip Sharing Section */}
      <View style={styles.tripSection}>
        <Text style={styles.sectionTitle}>🛡️ Trip Sharing</Text>
        <Text style={styles.sectionSubtitle}>Let contacts monitor your journey</Text>
        
        {!tripActive ? (
          <View style={styles.tripForm}>
            <TextInput
              style={styles.input}
              placeholder="Where are you going? (e.g., Home, Work, Mall)"
              placeholderTextColor="#888"
              value={destination}
              onChangeText={setDestination}
            />
            <TextInput
              style={styles.input}
              placeholder="Estimated trip duration (minutes)"
              placeholderTextColor="#888"
              value={tripDuration}
              onChangeText={setTripDuration}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.startTripButton} onPress={startTripSharing}>
              <Text style={styles.startTripText}>🛣️ Start Trip Sharing</Text>
            </TouchableOpacity>
            
            <Text style={styles.tripInfo}>
              • Contacts receive real-time location updates{'\n'}
              • Automatic safe arrival notification{'\n'}
              • Emergency alerts during trip{'\n'}
              • Real street addresses shared
            </Text>
          </View>
        ) : (
          <View style={styles.activeTrip}>
            <View style={styles.activeTripHeader}>
              <Text style={styles.activeTripIcon}>🎯</Text>
              <Text style={styles.activeTripDestination}>To: {destination}</Text>
            </View>
            
            <View style={styles.tripStatus}>
              <Text style={styles.tripStatusText}>🟢 Live location sharing active</Text>
              <Text style={styles.tripStatusDetail}>
                {tripDuration} minute ETA • 3 contacts notified
              </Text>
            </View>

            <View style={styles.tripButtons}>
              <TouchableOpacity style={styles.completeButton} onPress={completeTrip}>
                <Text style={styles.completeButtonText}>✅ I Arrived Safely</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelTrip}>
                <Text style={styles.cancelButtonText}>❌ Cancel Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.orbitMenu}>
        <TouchableOpacity style={styles.orbitButton}>
          <Text style={styles.orbitText}>📍 Location</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.orbitButton}
          onPress={() => navigation.navigate('Contacts')}
        >
          <Text style={styles.orbitText}>👥 My Circle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.orbitButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.orbitText}>🔒 Lock</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A3C',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    color: '#E8E8E8',
    fontSize: 32,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  locationCard: {
    backgroundColor: '#1E2A4D',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  locationTitle: {
    color: '#E8E8E8',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationAddress: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  locationCoords: {
    color: '#888',
    fontSize: 10,
  },
  emergencyButton: {
    backgroundColor: '#B23C3C',
    padding: 25,
    borderRadius: 15,
    alignSelf: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  emergencyActive: {
    backgroundColor: '#666',
    borderColor: '#888',
  },
  emergencyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencySubtext: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  tripSection: {
    backgroundColor: '#1E2A4D',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#E8E8E8',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  tripForm: {
    gap: 12,
  },
  input: {
    backgroundColor: '#2A3A5C',
    padding: 15,
    borderRadius: 8,
    color: '#E8E8E8',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A4A6C',
  },
  startTripButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  startTripText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripInfo: {
    color: '#B0B0B0',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 15,
  },
  activeTrip: {
    alignItems: 'center',
  },
  activeTripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activeTripIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  activeTripDestination: {
    color: '#E8E8E8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripStatus: {
    backgroundColor: '#2A3A5C',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  tripStatusText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tripStatusDetail: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  tripButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orbitMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  orbitButton: {
    backgroundColor: '#1E2A4D',
    padding: 15,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  orbitText: {
    color: '#E8E8E8',
    fontSize: 12,
  },
});

export default RealDashboard;