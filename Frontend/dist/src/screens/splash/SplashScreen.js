import { StyleSheet, Text, View, Image } from 'react-native';
import React,{useEffect} from 'react';
import { SW, SH } from '../../utils/dimensions';
import { loginImg, Spalsh_Logo } from '../../images/index.js';
import ContainerComponent from '../../components/commonComponents/Container.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';


const SplashScreen = ({navigation}) => {
  const token = useSelector((state) => state.auth.token);
  const intialPage = async()=>{
  let access = await AsyncStorage.getItem('access_token')
    let isPaid = await AsyncStorage.getItem('isPaid')
console.log(isPaid,"ispaid")
  console.log("tokenS",access)
if(access !== null && isPaid == 'true'){
  // navigation.replace('BottomTabNavigations');
}else if(access !== null){
   //S navigation.replace('SignUpScreen');
}
    }
      useEffect(()=>{
    //  intialPage()
    })
   useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('SwipperScreen');
    }, 3000);
    return () => clearTimeout(timer); // cleanup
  }, [navigation]);

  return (
    <ContainerComponent>
      <View style={styles.setbgimage}>
        <View>
          <Image
            style={styles.valuxlogoimg}
            resizeMode="contain"
            source={loginImg}
          />
        </View>
      </View>
    </ContainerComponent>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  valuxlogoimg: {
    width: SW(200),
    height: SH(200),
    resizeMode:'contain'
  },
  setbgimage: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
