import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('demo@luna.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleQuickStart = () => {
    // For demo purposes, navigate directly to the app
    navigation.navigate('DisguisedFlashlight');
  };

  const handleDemoLogin = () => {
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Demo Mode Activated',
        'You are now in demo mode. Use triple-tap on the flashlight screen to access Luna safety features.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('DisguisedFlashlight')
          }
        ]
      );
    }, 1500);
  };

  const handleCreateAccount = () => {
    Alert.alert(
      'Account Creation',
      'In the full version, users can create accounts with Firebase Authentication for cloud backup of emergency contacts and alert history.',
      [
        { text: 'OK' }
      ]
    );
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Password Recovery',
      'In production, this would send a password reset email via Firebase Authentication.',
      [
        { text: 'OK' }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>🌙 Luna</Text>
          <Text style={styles.subtitle}>Your Discreet Safety Companion</Text>
        </View>

        {/* Demo Info Card */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Hackathon Demo</Text>
          <Text style={styles.demoText}>
            Experience Luna's innovative disguised safety features. The app looks like a flashlight but hides emergency tools.
          </Text>
          
          <View style={styles.credentials}>
            <Text style={styles.credentialText}>📧 Email: demo@luna.com</Text>
            <Text style={styles.credentialText}>🔐 Password: 123456</Text>
          </View>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Quick Start Button */}
          <TouchableOpacity 
            style={[styles.quickStartButton, loading && styles.buttonDisabled]}
            onPress={handleDemoLogin}
            disabled={loading}
          >
            <Text style={styles.quickStartText}>
              {loading ? 'LOADING DEMO...' : '🚀 QUICK START DEMO'}
            </Text>
          </TouchableOpacity>

          {/* Alternative Options */}
          <View style={styles.alternativeOptions}>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={styles.alternativeText}>Create New Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.alternativeText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Features Preview */}
          <View style={styles.featuresPreview}>
            <Text style={styles.featuresTitle}>What makes Luna different:</Text>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔦</Text>
              <Text style={styles.featureText}>Looks like a normal flashlight app</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Secret triple-tap to access safety features</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚨</Text>
              <Text style={styles.featureText}>One-tap emergency alerts with location</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>👥</Text>
              <Text style={styles.featureText}>Manage your emergency contact circle</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built for FNB App of the Year Hackathon 2025
          </Text>
          <Text style={styles.teamText}>Team moo_Tech</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1A3C',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E8E8E8',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  demoCard: {
    backgroundColor: '#1E2A4D',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#B23C3C',
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E8E8E8',
    marginBottom: 10,
  },
  demoText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 15,
  },
  credentials: {
    backgroundColor: '#2A3A5C',
    padding: 15,
    borderRadius: 8,
  },
  credentialText: {
    color: '#E8E8E8',
    fontSize: 14,
    marginBottom: 5,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1E2A4D',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    color: '#E8E8E8',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A3A5C',
  },
  quickStartButton: {
    backgroundColor: '#B23C3C',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  quickStartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alternativeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  alternativeText: {
    color: '#B23C3C',
    fontSize: 14,
    fontWeight: '500',
  },
  featuresPreview: {
    backgroundColor: '#1E2A4D',
    padding: 20,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E8E8E8',
    marginBottom: 15,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    color: '#B0B0B0',
    fontSize: 14,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A3A5C',
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  teamText: {
    color: '#B23C3C',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;