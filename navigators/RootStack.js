// RootStack.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../components/styles';
const { primary, tertiary, brand } = Colors;

import Login from './../screens/Login'; 
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import Schedule from '../screens/Schedule';
import Scripts from '../screens/Scripts';
import About from '../screens/About';
import Calendar from '../screens/Calendar';
import Bookings from '../screens/My_Bookings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, name }) => {
  return <Ionicons name={name} size={focused ? 24 : 20} color={focused ? brand : 'gray'} />;
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Welcome') {
            iconName = 'home-outline';
          } 
          else if (route.name === 'Schedule') {
            iconName = 'time-outline';
          } 
          else if (route.name === 'Calendar') {
            iconName = 'calendar-outline';
          }
          else if (route.name === 'Bookings') {
            iconName = 'bonfire-outline';
          }
          else if (route.name === 'Scripts') {
            iconName = 'document-text-outline';
          }
          else if (route.name === 'About Us') {
            iconName = 'information-circle-outline';
          }

          return <TabIcon focused={focused} name={iconName} />;
        },
        tabBarActiveTintColor: brand,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
      })}
    >
      <Tab.Screen options={{headerShown: false}} name="Welcome" component={Welcome} />
      <Tab.Screen options={{headerShown: false}} name="Schedule" component={Schedule} />
      <Tab.Screen options={{headerShown: false}} name="Bookings" component={Bookings} />
      <Tab.Screen /*options={{headerShown: false}}*/ name="Calendar" component={Calendar} />
      <Tab.Screen /*options={{headerShown: false}}*/ name="Scripts" component={Scripts} />
      <Tab.Screen /*options={{headerShown: false}}*/ name="About Us" component={About} />
    </Tab.Navigator>
  );
};

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: tertiary,
          headerTransparent: true,
          headerTitle: '',
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="BottomTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;