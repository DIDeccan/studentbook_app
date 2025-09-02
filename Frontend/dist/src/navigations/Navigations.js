import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash/SplashScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SwipperScreen from '../screens/onboardSwiper/SwipperScreen';
import LandingPage from '../screens/landingPage/LandingPage';
import SignUpScreen from '../screens/auth/signup/SignUpScreen';
import LoginScreen from '../screens/auth/login/LoginScreen';
import BottomTabNavigations from './BottomTabNavigation';
import ContentSection from '../screens/chooseContant/ContentSection';
import MathSubject from '../screens/subjects/MathSubject';
import EnglishSubject from '../screens/subjects/EnglishSbject';
import TeluguSubject from '../screens/subjects/TeluguSubject';
import PrivacyPolicyScreen from '../screens/profileSection/PrivacyPolicyScreen';
import EditProfile from '../screens/profileSection/EditProfile';
import AboutUs from '../screens/profileSection/AboutUs';
import ContactUs from '../screens/profileSection/ContactUs';
import TermsAndConditions from '../screens/profileSection/TermsAndConditions';
import PaymentScreen from '../screens/auth/payment/PaymentScreen';
import SettingScreen from '../screens/profileSection/SettingScreen';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import CreatePassword from '../screens/auth/forgotPassword/CreatePassword';

const Stack = createNativeStackNavigator();

const Navigations = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SwipperScreen" component={SwipperScreen} />
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="BottomTabNavigations"
        component={BottomTabNavigations}
      />
      <Stack.Screen name="ContentSection" component={ContentSection} />
      <Stack.Screen name="MathSubject" component={MathSubject} />
      <Stack.Screen name="EnglishSubject" component={EnglishSubject} />
      <Stack.Screen name="TeluguSubject" component={TeluguSubject} />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
       <Stack.Screen name="CreatePassword" component={CreatePassword} />
    </Stack.Navigator>
  );
};

export default Navigations;
