import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SF, SH } from '../utils/dimensions';
import HomeScreen from '../screens/home/HomeScreen';
import MyLearnings from '../screens/mylearnings/MyLearnings';
import HelpSection from '../screens/help/HelpSection';
import ProfileSection from '../screens/profileSection/ProfileSection';

const Tab = createBottomTabNavigator();

const BottomTabNavigations = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
       tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'white',
       tabBarLabelStyle: { fontSize: SF(12) },
        tabBarStyle: {
         backgroundColor: 'rgba(145, 145, 211, 1)',
         alignItems:'center',
         justifyContent:'center',
         height:SH(75),
          //height: SH(18),
        //  paddingVertical: SH(2),
          paddingTop: SH(12),
          shadowColor: '#ccc',
        //  shadowOffset: { width: 0, height: -2 }, // <- Above the tab bar
          shadowOpacity: 0.1,
          shadowRadius: 6,

          //Android elevation
          elevation: 3,
        },
        tabBarButton: props => (
          <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={props.style}>{props.children}</View>
          </TouchableWithoutFeedback>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          const iconColor = focused ? 'blue' : 'white';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'learn':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            case 'Help':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return (
            <Ionicons name={iconName} size={SF(23)} color={iconColor} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="learn" component={MyLearnings} />
      <Tab.Screen name="Help" component={HelpSection} />
      <Tab.Screen name="Profile" component={ProfileSection} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigations;

const styles = StyleSheet.create({});
