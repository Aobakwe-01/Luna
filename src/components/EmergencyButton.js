import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

const EmergencyButton = ({ active, onPress, disabled = false }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      // Pulsing animation when active
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [active, pulseAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <TouchableOpacity 
        style={[
          styles.emergencyButton, 
          active && styles.emergencyActive,
          disabled && styles.emergencyDisabled
        ]}
        onPress={onPress}
        disabled={disabled || active}
      >
        <Text style={styles.emergencyText}>
          {active ? '🔄 SENDING...' : '🚨 ACTIVATE'}
        </Text>
        <Text style={styles.emergencySubtext}>
          {active ? 'Emergency alert in progress' : 'Press & hold for 3 seconds'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emergencyButton: {
    backgroundColor: '#B23C3C',
    padding: 35,
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    minHeight: 200,
    borderWidth: 4,
    borderColor: '#FF6B6B',
  },
  emergencyActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF5252',
  },
  emergencyDisabled: {
    backgroundColor: '#666',
    borderColor: '#888',
  },
  emergencyText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emergencySubtext: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default EmergencyButton;