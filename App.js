import React, { useEffect, useState } from 'react';
import { BackHandler, View, ActivityIndicator } from 'react-native';
import { auth } from './firebase'; // Ensure you import the correct auth instance
import RootStack from './navigators/RootStack';
import { NavigationContainer } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Start'); // Default to Start screen

  useEffect(() => {
    const handleBackButton = () => true;

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setInitialRoute('BottomTabs'); // Set the initial route to BottomTabs if the user is logged in
      } else {
        setInitialRoute('Start'); // Set the initial route to Start if the user is not logged in
      }
      setLoading(false); // Ensure loading state is updated after setting the initial route
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
    <NavigationContainer ref={navigationRef}>
      <RootStack initialRouteName={initialRoute} /> 
    </NavigationContainer>
  );
}
