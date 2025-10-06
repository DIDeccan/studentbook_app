import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { SW, SH } from '../../utils/dimensions';
import { logoImg } from '../../images/index.js';
import ContainerComponent from '../../components/commonComponents/Container.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const checkInitialPage = async () => {
    try {
      let access = await AsyncStorage.getItem('access_token');
      let isPaid = await AsyncStorage.getItem('isPaid'); // "true" or "false"
      let isRegistered = await AsyncStorage.getItem('isRegistered'); // "true" after registration

      console.log("Token:", access);
      console.log("isPaid:", isPaid);
      console.log("isRegistered:", isRegistered);

      if (access && isPaid === 'true') {
        // ✅ Logged in + Paid
        navigation.replace('BottomTabNavigations');
      } else if (isRegistered === 'true' && isPaid !== 'true') {
        // ✅ Registered but not paid → Signup screen
        navigation.replace('SignUpScreen');
      } else if (isRegistered === 'true' && isPaid === 'true' && !access) {
        // ✅ Registered + Paid but logged out → Login screen
        navigation.replace('LoginScreen');
      } else {
        // ✅ First-time install → Landing
        navigation.replace('SwipperScreen');
      }
    } catch (e) {
      console.log("Error reading AsyncStorage", e);
      navigation.replace('SwipperScreen');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkInitialPage();
    }, 2000); // splash delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <ContainerComponent>
      <View style={styles.setbgimage}>
        <Image
          style={styles.valuxlogoimg}
          resizeMode="contain"
          source={logoImg}
        />
      </View>
    </ContainerComponent>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  valuxlogoimg: {
    width: SW(200),
    height: SH(200),
    resizeMode: 'contain',
  },
  setbgimage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
