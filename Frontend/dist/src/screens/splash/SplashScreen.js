import { StyleSheet, Text, View, Image } from 'react-native';
import React,{useEffect} from 'react';
import { SW, SH, SF } from '../../utils/dimensions';
import { loginImg, Spalsh_Logo, Spalsh_Logo1 } from '../../images/index.js';
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
   navigation.replace('BottomTabNavigations');
}else if(access !== null){
    navigation.replace('SignUpScreen');
}
    }
  useEffect(()=>{
    intialPage()
    })
    
   useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('SwipperScreen');
    }, 4000);
    return () => clearTimeout(timer); // cleanup
  }, [navigation]);

  return (
    <ContainerComponent>
      <View style={styles.setbgimage}>
        <View>
          <Image
            style={styles.valuxlogoimg}
            resizeMode="contain"
            source={Spalsh_Logo1}
          />
          {/* <Text style={{fontSize:SF(20),textAlign:'center'}}>Student Book</Text> */}
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
