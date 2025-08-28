import React from 'react';
import {Text} from 'react-native'
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MyProfile from '../screens/profile/MyProfile';
// import MyLearnings from '../screens/mylearnings/MyLearnings';
// import HelpSection from '../screens/help/HelpSection';
// import Downloads from '../screens/downloads/Downloads';

//const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <>
    <Text>Hiii</Text>
     {/* <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: 'blue',
        drawerInactiveTintColor: 'gray',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen name="MyProfile" component={MyProfile} options={{
    drawerIcon: ({ focused, size }) => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={size}
        color={focused ? 'blue' : 'gray'}
      />
    ),
  }}/>
      <Drawer.Screen name="Learn" component={MyLearnings}options={{
    drawerIcon: ({ focused, size }) => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={size}
        color={focused ? 'blue' : 'gray'}
      />
    ),
  }} />
      <Drawer.Screen name="Help" component={HelpSection}options={{
    drawerIcon: ({ focused, size }) => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={size}
        color={focused ? 'blue' : 'gray'}
      />
    ),
  }} />
      <Drawer.Screen name="Downloads" component={Downloads} options={{
    drawerIcon: ({ focused, size }) => (
      <Ionicons
        name={focused ? 'person' : 'person-outline'}
        size={size}
        color={focused ? 'blue' : 'gray'}
      />
    ),
  }}/>
    </Drawer.Navigator> */}
    </>
 
  );
};

export default DrawerNavigation;
