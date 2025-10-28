import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Vibration } from 'react-native';

const RealDashboard = ({ navigation }) => {
  const [emergencyActive, setEmergencyActive] = useState(false);

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
      `Alert will send in ${countdown} seconds...`,
      [
        { 
          text: "CANCEL", 
          style: "destructive",
          onPress: () => {
            clearInterval(countdownInterval);
            setEmergencyActive(false);
          }
        }
      ]
    );
  };

  const triggerEmergencyAlert = () => {
    Alert.alert(
      "Alert Sent!",
      "Your location has been shared with your emergency contacts.",
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Luna</Text>
      <Text style={styles.subtitle}>Your safety companion</Text>
      
      <TouchableOpacity 
        style={[styles.emergencyButton, emergencyActive && styles.emergencyActive]}
        onPress={handleEmergencyPress}
        disabled={emergencyActive}
      >
        <Text style={styles.emergencyText}>
          {emergencyActive ? 'SENDING...' : 'ACTIVATE'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.orbitMenu}>
        <TouchableOpacity style={styles.orbitButton}>
          <Text style={styles.orbitText}>Share Path</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.orbitButton}
          onPress={() => navigation.navigate('Contacts')}
        >
          <Text style={styles.orbitText}>My Circle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.orbitButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.orbitText}>Lock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F1A3C',
  },
  header: {
    color: '#E8E8E8',
    fontSize: 32,
    textAlign: 'center',
    marginTop: 60,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 50,
  },
  emergencyButton: {
    backgroundColor: '#B23C3C',
    padding: 35,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  emergencyActive: {
    backgroundColor: '#666',
  },
  emergencyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orbitMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 80,
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