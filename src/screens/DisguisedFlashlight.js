import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Vibration } from 'react-native';

const DisguisedFlashlight = ({ navigation }) => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimeout = useRef(null);

  const handleSecretGesture = () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
      tapTimeout.current = setTimeout(() => setTapCount(0), 1000);
      
      if (newCount >= 3) {
        setTapCount(0);
        Vibration.vibrate(100);
        navigation.navigate('RealDashboard');
      }
      return newCount;
    });
  };

  const toggleFlashlight = () => {
    setFlashlightOn(!flashlightOn);
  };

  return (
    <View style={[styles.container, flashlightOn && styles.lightOn]}>
      <TouchableOpacity style={styles.secretArea} onPress={handleSecretGesture} />
      <Text style={styles.title}>BrightLight LED</Text>
      <TouchableOpacity style={[styles.flashlightButton, flashlightOn && styles.buttonOn]} onPress={toggleFlashlight}>
        <Text style={styles.buttonText}>{flashlightOn ? 'TURN OFF' : 'TURN ON'}</Text>
      </TouchableOpacity>
      <Text style={styles.fakeAd}>🔋 Battery Saver Technology</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  lightOn: { backgroundColor: '#ffffcc' },
  secretArea: { position: 'absolute', top: 0, height: 100, width: '100%', backgroundColor: 'transparent' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#666', marginBottom: 50 },
  flashlightButton: { backgroundColor: '#333', padding: 30, borderRadius: 60, borderWidth: 2, borderColor: '#555' },
  buttonOn: { backgroundColor: '#FFD700', borderColor: '#FFA500' },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  fakeAd: { marginTop: 30, color: '#888', fontSize: 14 },
});

export default DisguisedFlashlight;