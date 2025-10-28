import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase service for authentication and database operations
class FirebaseService {
  // Authentication methods
  static async signIn(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async signUp(email, password) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async signOut() {
    try {
      await auth().signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static getCurrentUser() {
    return auth().currentUser;
  }

  // Emergency Contacts management
  static async addEmergencyContact(contactData) {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');

      const contactRef = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('emergencyContacts')
        .add({
          ...contactData,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return { success: true, contactId: contactRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getEmergencyContacts() {
    try {
      const user = auth().currentUser;
      if (!user) return [];

      const snapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('emergencyContacts')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  }

  // Emergency Alerts
  static async createEmergencyAlert(location, contacts = []) {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');

      const alertData = {
        userId: user.uid,
        userName: user.email,
        userEmail: user.email,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: 'active',
        contacts: contacts,
        address: 'Current Location',
        type: 'emergency'
      };

      const alertRef = await firestore().collection('emergencyAlerts').add(alertData);
      
      return { success: true, alertId: alertRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user's alert history
  static async getAlertHistory() {
    try {
      const user = auth().currentUser;
      if (!user) return [];

      const snapshot = await firestore()
        .collection('emergencyAlerts')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting alert history:', error);
      return [];
    }
  }
}

export default FirebaseService;