import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import './firebase.js';

import RootStack from './navigators/RootStack'

export default function App() {
  useEffect(() => {
    const handleBackButton = () => true;

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return <RootStack />
}

// test