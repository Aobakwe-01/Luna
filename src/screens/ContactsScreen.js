import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';

const ContactsScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  const addContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    const newContactWithId = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone
    };

    setContacts([...contacts, newContactWithId]);
    setNewContact({ name: '', phone: '' });
    Alert.alert('Success', 'Contact added to your emergency circle');
  };

  const removeContact = (contactId) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setContacts(contacts.filter(contact => contact.id !== contactId));
          }
        }
      ]
    );
  };

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeContact(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Emergency Circle</Text>
      <Text style={styles.subtitle}>These people will be alerted in emergencies</Text>
      
      <View style={styles.addContactSection}>
        <TextInput
          style={styles.input}
          placeholder="Contact Name"
          placeholderTextColor="#888"
          value={newContact.name}
          onChangeText={(text) => setNewContact({...newContact, name: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          value={newContact.phone}
          onChangeText={(text) => setNewContact({...newContact, phone: text})}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>Add to Circle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        style={styles.contactsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No emergency contacts added yet</Text>
        }
      />

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Safety Dashboard</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E8E8E8',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 30,
  },
  addContactSection: {
    backgroundColor: '#1E2A4D',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2A3A5C',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    color: '#E8E8E8',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#B23C3C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E2A4D',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: '#E8E8E8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#2A3A5C',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#B23C3C',
    fontSize: 12,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#2A3A5C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#E8E8E8',
    fontSize: 16,
  },
});

export default ContactsScreen;