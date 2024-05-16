import { StatusBar } from 'expo-status-bar';
import React from 'react';
import './firebase.js';

import RootStack from './navigators/RootStack'

export default function App() {
  return <RootStack />
}
