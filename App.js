import React, { useEffect, useState } from 'react';
import { BackHandler, View, ActivityIndicator } from 'react-native';
import { auth } from './firebase'; // Ensure you import the correct auth instance
import RootStack from './navigators/RootStack';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleBackButton = () => true;

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      unsubscribe(); // Unsubscribe from the listener when the component unmounts
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <RootStack />  // No NavigationContainer here if it's already in RootStack
  );
}
