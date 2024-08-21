import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../components/styles';
import { View, Text, TouchableOpacity } from 'react-native'; // Ensure Text is imported
const { tertiary, brand } = Colors;

import Login from './../screens/Login'; 
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import Schedule from '../screens/Schedule';
import Scripts from '../screens/Scripts';
import About from '../screens/About';
import Calendar from '../screens/Calendar';
import Bookings from '../screens/Booking';
import Start from '../screens/Start';

import Calendarstart from '../screens/Calendarstart';
import Aboutstart from '../screens/Aboutstart';
import Scriptsstart from '../screens/Scriptsstart';

import Mathawelcome from '../matha_screens/mathawelcome';  
import Mathafood from '../matha_screens/mathafood';  
import Foodlist from '../matha_screens/foodlist';

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
          else if (route.name === 'Songs') {
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
          display: 'flex',
          justifyContent: 'center',
          zIndex: 0,
        },
      })}
    >
      <Tab.Screen options={{headerShown: false}} name="Welcome" component={Welcome} />
      <Tab.Screen options={{headerShown: false}} name="Schedule" component={Schedule} />
      <Tab.Screen options={{headerShown: false}} name="Bookings" component={Bookings} />
      <Tab.Screen options={{headerShown: true}} name="Calendar" component={Calendar} />
      <Tab.Screen options={{headerShown: false}} name="Songs" component={Scripts} />
      <Tab.Screen options={{headerShown: false}} name="About Us" component={About} />
    </Tab.Navigator>
  );
};

const MathaTabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerLeft: () => (
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center' }} 
            onPress={() => navigation.navigate('BottomTabs')}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={tertiary}
              style={{ marginLeft: 20 }}
            />
            <Text style={{ color: tertiary, marginLeft: 10, fontSize: 16 }}>
              Back to Scheduling
            </Text>
          </TouchableOpacity>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Matha Home') {
            iconName = 'home-outline';
          }
          else if (route.name === 'Food Selection') {
            iconName = 'flame-outline';
          }
          else if (route.name === 'Food List') {
            iconName = 'leaf-outline';
          }
          else if (route.name === 'Calendar') {
            iconName = 'calendar-outline';
          }
          else if (route.name === 'Songs') {
            iconName = 'document-text-outline';
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
          display: 'flex',
          justifyContent: 'center',
          zIndex: 0,
        },
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: tertiary,
        headerTitle: '',
        headerLeftContainerStyle: {
          paddingLeft: 20,
        },
      })}
    >
      <Tab.Screen options={{headerShown: true}} name="Matha Home" component={Mathawelcome} />
      <Tab.Screen options={{headerShown: true}} name="Food Selection" component={Mathafood} />
      <Tab.Screen options={{headerShown: true}} name="Food List" component={Foodlist} />
      <Tab.Screen options={{headerShown: true}} name="Calendar" component={Calendar} />
      <Tab.Screen options={{headerShown: false}} name="Songs" component={Scripts} />
    </Tab.Navigator>
  );
};

const RootStack = ({ initialRouteName = 'Start' }) => {
  return (
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
        gestureEnabled: false,  // Disable swipe back gesture on iOS
      }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="Start" component={Start} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="Aboutstart" component={Aboutstart} options={{ headerShown: false }} />
      <Stack.Screen name="Calendarstart" component={Calendarstart} options={{ headerShown: false }} />
      <Stack.Screen name="Scriptsstart" component={Scriptsstart} options={{ headerShown: false }} />
      <Stack.Screen name="BottomTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen 
        name="MathaTabs" 
        component={MathaTabNavigator} 
        options={{ 
          headerShown: false,
          gestureEnabled: false,  // Disable swipe back gesture on iOS
        }} 
      />
    </Stack.Navigator>
  );
};

export default RootStack;
