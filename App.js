import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DisguisedFlashlight from './src/screens/DisguisedFlashlight';
import RealDashboard from './src/screens/RealDashboard';
import ContactsScreen from './src/screens/ContactsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DisguisedFlashlight" component={DisguisedFlashlight} />
        <Stack.Screen name="RealDashboard" component={RealDashboard} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;