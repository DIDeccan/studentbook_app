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
import { loginImg, userProfile } from '../../../images';
import ContainerComponent from '../../../components/commonComponents/Container';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../../redux/reducer/authReducer';
import { darkColors, lightColors } from '../../../utils/Colors';

const LoginScreen = props => {
    const themeMode = useSelector((state) => state.theme.theme);
    let colors = (themeMode === 'dark') ? darkColors : lightColors;
    const styles = themedStyles(colors);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { user,error } = useSelector(state => state.auth);
  const [emailerror, setEmailerror] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleLogin = async () => {
    props.navigation.replace('BottomTabNavigations');
    setEmailerror(true);
    setPasswordError(true);
    if (password !== '') {
       setLoading(true);
      try {
        const login = await dispatch(
          loginAction({ email: username, password:password }),
        ).unwrap();

        console.log('Login success:', login);
        Alert.alert('Success', login.message || 'Login successful');
        setVisible(true);
         props.navigation.replace('BottomTabNavigations');
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
    props.navigation.navigate('ForgotPassword');
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
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
            <Image source={loginImg} style={styles.loginImage} />
            <Text style={styles.title}>{translate('textWelcomeBack')}</Text>
            <Text style={styles.subTitleTxt}>
              {translate('textPleaseEnterDetails')}
            </Text>
            <Input
              keyboardType="email-address"
              title={translate('textEmail')}
              placeholder={translate('textForEmailForPlaceholder')}
              value={username}
              onChangeHandler={e => setUsername(e)}
              textInputProps={{
                style: styles.inputStyle,
              }}
            />
            {!checkEmailValidation(username) && emailerror ? (
              <View style={{}}>
                <Text style={styles.ErrorMsg}>{translate('validEmail')}</Text>
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
                    color={''}
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
            >
              <Text style={styles.loginTextStyle}>{translate('login')}</Text>
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
    marginBottom: SH(20),
    textAlign: 'center',
  },
  title: {
    fontSize: SF(22),
    fontFamily: Fonts.Bold,
    textAlign: 'center',
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
    height: SH(100),
    width: SW(100),
    marginTop: SH(15),
    marginBottom: SH(10),
    alignSelf: 'center',
    resizeMode: 'stretch',
    borderRadius: SH(100),
  },
  mainView: {
    height: SH(700),
    padding: SW(15),
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
  },
  dontHAc: {
    fontSize: SF(15),
  },
  signUp: {
    fontSize: SF(15),
    fontFamily: Fonts.Bold,
    marginLeft: SW(1),
    color: 'blue',
  },
  forgotPass: {
    fontSize: SF(15),
    color: 'blue',
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
  loader: {
    position: 'absolute',
    marginTop: SH(40),
    alignSelf: 'center',
    zIndex: 20,
  },
});
export default LoginScreen;
