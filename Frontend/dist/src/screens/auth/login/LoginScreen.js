import React, { useEffect, useContext, useState } from 'react';
import {
  Text,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { translate } from '../../../utils/config/i18n';
import { checkEmailValidation } from '../../../utils/utils';
import Input from '../../../components/commonComponents/Input';
import { SF, SH, SW } from '../../../utils/dimensions';
import Fonts from '../../../utils/Fonts';
import { loginImg, Spalsh_Logo1, userProfile } from '../../../images';
import ContainerComponent from '../../../components/commonComponents/Container';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../../redux/reducer/authReducer';
import { darkColors, lightColors } from '../../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = props => {
    const themeMode = useSelector((state) => state.theme.theme);
    let colors = (themeMode === 'dark') ? darkColors : lightColors;
    const styles = themedStyles(colors);
  const [password, setPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [passwordError, setPasswordError] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
 const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneerror] = useState(false);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;



  const handleLogin = async () => {
    //props.navigation.replace('BottomTabNavigations');
    setPhoneerror(true)
    setPasswordError(true);
    if (phoneRegex.test(phone) &&  passwordRegex.test(password)) {
       setLoading(true);
      try {
        const login = await dispatch(
          loginAction({ phone_number: phone, password:password }),
        ).unwrap();
         
        console.log('Login success:', login);
     await AsyncStorage.setItem("access_token", login.access);
await AsyncStorage.setItem("refresh_token", login.refresh);
await AsyncStorage.setItem("studentId"   ,String(login?.student_id))
await AsyncStorage.setItem("classId",String(login?.class_id))
await AsyncStorage.setItem("isPaid", JSON.stringify(login.is_paid))
//await AsyncStorage.setItem("refresh_token", login.refresh);


   Alert.alert("Success", login.message || "Login successful", [
  { text: "OK", onPress: () =>  props.navigation.replace('BottomTabNavigations')}
]);
      } catch (err) {
        console.error('Login failed:', err);
        Alert.alert(
          translate('entervaliddata'),
          typeof err === 'string'
            ? err
            : err?.message || 'Something went wrong',
        );
      }finally {
        setLoading(false);
      }
    }
  };

  const goToSingUp = () => {
    props.navigation.navigate('SignUpScreen');
  };
  const goToForgetPassword = () => {
   // props.navigation.navigate('ForgotPassword');
     props.navigation.navigate('BottomTabNavigations');
  };

  return (
    <ContainerComponent>
        {loading && (
               <View style={styles.loaderOverlay}>
                 <ActivityIndicator size="large" color="green" />
               </View>
             )}
      <TouchableWithoutFeedback>
        <ScrollView>
          <View style={[styles.mainView]}>
            {/* <StatusBar backgroundColor={'white'} barStyle={'dark-content'} /> */}
            <Image source={Spalsh_Logo1} style={styles.loginImage} />
            <Text style={styles.title}>{translate('textWelcomeBack')}</Text>
            <Text style={styles.subTitleTxt}>
              {translate('textPleaseEnterDetails')}
            </Text>
            <Input
                placeholderTextColor={''}
                title={translate('textPhone')}
                maxLength={10}
                placeholder="9700 022 225"
                keyboardType="number-pad"
                value={phone}
                onChangeHandler={e => setPhone(e)}
                textInputProps={{
                  style: styles.inputStyle,
                }}
              />
              {!phoneRegex.test(phone) && phoneError ? (
                <View>
                  <Text style={styles.ErrorMsg}>
                    {translate('validNumber')}
                  </Text>
                </View>
              ) : null}
            <Input
              placeholderTextColor={'blue' + '70'}
              keyboardType="default"
              title="Password"
              value={password}
              textInputProps={{
                style: styles.inputStyle,
              }}
              showPassword={!passVisible}
              onChangeHandler={text => setPassword(text)}
              placeholder="Enter your password"
              isRight={true}
              rightContent={
                <TouchableOpacity
                  onPress={() => setPassVisible(!passVisible)}
                  style={[styles.row, { paddingRight: SW(10) }]}
                >
                  <MaterialCommunityIcons
                    size={SH(30)}
                    color={colors.text}
                    name={passVisible ? 'eye-outline' : 'eye-off-outline'}
                  />
                </TouchableOpacity>
              }
            />
            {!passwordRegex.test(password) && passwordError ? (
              <View style={{}}>
                <Text style={styles.ErrorMsg}>
                  {translate('errorPasswordMsg')}
                </Text>
              </View>
            ) : null}
            <Text onPress={goToForgetPassword} style={styles.forgotPass}>
              {translate('textForgotPassword')}
            </Text>
            <TouchableOpacity
              style={styles.loginButtonStyle}
              onPress={handleLogin}
                 disabled={loading}>
                   <Text style={styles.loginTextStyle}>{translate('login')}</Text>
                            {/* {loading ? (
                              <ActivityIndicator color="#fff" /> 
                            ) : (
                              <Text style={styles.loginTextStyle}>{translate('login')}</Text>
                            )} */}
              
            </TouchableOpacity>
            <View style={styles.signUpTxtWrapper}>
              <Text style={styles.dontHAc}>
                {translate('textDontHaveAccount')}
              </Text>
              <Text style={styles.signUp} onPress={goToSingUp}>
                {translate('textSingupForFree')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </ContainerComponent>
  );
};
const themedStyles =(colors)=> StyleSheet.create({
  container: {
    flex: 1,
  },
  loginTextStyle: {
    color: colors.background,
    fontFamily: Fonts.Bold,
    fontSize: SF(16),
    padding: SH(10),
    textAlign: 'center',
  },
  loginButtonStyle: {
    backgroundColor: colors.primary,
    marginTop: SH(10),
    borderRadius: SH(10),
  },

  subTitleTxt: {
    fontSize: SF(16),
    fontFamily: Fonts.Medium,
    marginBottom: SH(10),
    textAlign: 'center',
    color:colors.text
  },
  title: {
    fontSize: SF(22),
    fontFamily: Fonts.Bold,
    textAlign: 'center',
    color:colors.text
  },
  textInput: {
    borderWidth: 1,
    borderRadius: SW(1),
    paddingVertical: SH(1),
    paddingHorizontal: SW(3),
    marginBottom: SH(10),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  loginImage: {
    height: SH(140),
    width: SW(140),
    //marginTop: SH(15),
    marginBottom: SH(10),
    alignSelf: 'center',
    resizeMode: 'stretch',
    borderRadius: SH(100),
  },
  mainView: {
    height: SH(700),
    padding: SW(17),
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpTxtWrapper: {
    flexDirection: 'row',
    marginTop: SH(20),
    alignItems: 'center',
    justifyContent: 'center',
    color:colors.text
  },
  dontHAc: {
    fontSize: SF(15),
    color:colors.text
  },
  signUp: {
    fontSize: SF(15),
    fontFamily: Fonts.Bold,
    marginLeft: SW(1),
    color: colors.primary,
  },
  forgotPass: {
    fontSize: SF(15),
    color: colors.primary,
    alignSelf: 'flex-end',
    marginTop: SF(10),
    ...Platform.select({
      ios: {
        fontWeight: '500',
      },
      android: {
        fontFamily: Fonts.Medium,
      },
    }),
  },

  ErrorMsg: {
    fontSize: SF(12),
    color: 'red',
    marginLeft: SW(1),
  },
  inputStyle: {
    fontFamily: Fonts.Medium,
    fontSize: SF(15),
    justifyContent: 'center',
    width: SW(300),
  },
  loaderOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.3)", // dim background
  zIndex: 999,
},
});
export default LoginScreen;
