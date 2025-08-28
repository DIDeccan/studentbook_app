import {
  Image,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ContainerComponent from '../../../components/commonComponents/Container';
import { translate } from '../../../utils/config/i18n';
import { checkEmailValidation } from '../../../utils/utils';
import { SF, SH, SW } from '../../../utils/dimensions';
import Fonts from '../../../utils/Fonts';
import Input from '../../../components/commonComponents/Input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  getClassNames,
  signUpAction,
  verifyOtp,
} from '../../../redux/reducer/authReducer';
import OTPInput from '../../../components/commonComponents/OTPInput';
import Colors, { darkColors, lightColors } from '../../../utils/Colors';
import RazorpayCheckout from 'react-native-razorpay';

const SignUpScreen = ({ navigation }) => {
  const themeMode = useSelector(state => state.theme.theme);
  let colors = themeMode === 'dark' ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [nameError, setnameError] = useState(false);
  const [phoneError, setPhoneerror] = useState(false);
  const [emailerror, setEmailerror] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [sectionError, setSectionError] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState('');
  const [conPassVisible, setConPassVisible] = useState(false);
  const [conPasswordError, setconfirmPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const dispatch = useDispatch();
  const { getClassData } = useSelector(state => state.auth);
  const [dropdownData, setDropdownData] = React.useState([]);
  const nameRegex = /^[a-zA-Z]+( [a-zA-z]+)*$/;
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const countryCodeData = [
    { id: 1, name: '6th Class' },
    { id: 2, name: '7th Class' },
    { id: 3, name: '8th Class' },
    { id: 4, name: '9th Class' },
    { id: 5, name: '10th Class' },
  ];
  useEffect(() => {
    dispatch(getClassNames());
  }, []);

  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const signUpButton = async () => {
    dispatch(getClassNames());
    setnameError(true);
    setPhoneerror(true);
    setEmailerror(true);
    setPasswordError(true);
    setSectionError(true);
    setconfirmPasswordError(true);

    if (
      nameRegex.test(fullName) &&
      passwordRegex.test(password) &&
      (email === '' || checkEmailValidation(email)) &&
      password === confirmPassword
    ) {
      try {
        setLoading(true);
        const result = await dispatch(
          signUpAction({
            email: email,
            first_name: fullName,
            last_name: '',
            phone_number: phone,
            address: '',
            zip_code: '',
            user_type: 'student',
            student_class: value,
            is_active: false,
            password: password,
          }),
        ).unwrap();

        console.log('Signup Success:', result);
        Alert.alert('Success', result.message);
        setShowOtpModal(true);
      } catch (err) {
        console.error('Signup Error:', err);
        Alert.alert(
          'Failed',
          typeof err === 'string'
            ? err
            : err?.message || 'Something went wrong',
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.name}</Text>
        {item.value === value && (
          <MaterialIcons
            size={SF(35)}
            color={''}
            name={'keyboard-arrow-down'}
          />
        )}
      </View>
    );
  };

  const onPayment = async () => {
    try {
      // Ideally: call your backend to create an order
      // const response = await fetch("http://YOUR_SERVER_IP:5000/create-order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ amount: 25900, currency: "INR" })
      // });
      // const order = await response.json();

      let options = {
        description: 'Credits towards consultation',
        image: '',
        currency: 'INR',
        key: 'rzp_test_nfY709knHa5l4u', // test key
        amount: 25900, // ✅ Amount in paise (25900 = ₹259)
        name: fullName || 'User',
        // order_id: order.id, // ✅ Use this when you have backend order
        prefill: {
          email: email,
          contact: phone,
          name: fullName,
        },
        theme: { color: '#53a20e' },
      };

      RazorpayCheckout.open(options)
        .then(data => {
          Alert.alert(
            'Payment Success',
            `Payment ID: ${data.razorpay_payment_id}`,
          );
          // here you can call backend API to confirm payment
        })
        .catch(error => {
          Alert.alert('Payment Failed', `${error.code} | ${error.description}`);
        });
    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert('Error', 'Something went wrong during payment');
    }
  };

  return (
    <ContainerComponent>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="green" />
          </View>
        )}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <View style={styles.ContainerStyle}>
            <Text style={styles.welcomeTextStyle}>
              {translate('Welcome to student book')}
            </Text>
            <Text style={[styles.detailsTextMessageStyle]}>
              {translate('textPleaseEnterDetails')}
            </Text>

            <View style={{ marginTop: SH(2) }}>
              <Input
                title={translate('textName')}
                placeholder="Full Name"
                value={fullName}
                onChangeHandler={e => setFullName(e)}
                textInputProps={{
                  style: styles.inputStyle,
                }}
              />
              {!nameRegex.test(fullName) && nameError ? (
                <View>
                  <Text style={styles.ErrorMsg}>{translate('validName')}</Text>
                </View>
              ) : null}
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
                keyboardType="email-address"
                title={translate('Email (optional)')}
                placeholder={translate('textForEmailForPlaceholder')}
                value={email}
                onChangeHandler={e => setEmail(e)}
                textInputProps={{
                  style: styles.inputStyle,
                }}
              />
              {!checkEmailValidation(email) && emailerror ? (
                <View>
                  <Text style={styles.ErrorMsg}>{translate('validEmail')}</Text>
                </View>
              ) : null}

              <Text style={{ fontSize: SF(15), marginTop: SH(5) }}>Class</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={countryCodeData}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => {
                  console.log('Dropdown opened');
                  // 🔹 Load or render your data here
                }}
                onChange={item => {
                  setValue(item.id);
                }}
                renderItem={renderItem}
              />
              {sectionError && value == '' ? (
                <View>
                  <Text style={styles.ErrorMsg}>
                    {translate('Select Class')}
                  </Text>
                </View>
              ) : null}
              <Input
                title={translate('textPassword')}
                placeholder="Password"
                showPassword={!passVisible}
                value={password}
                onChangeHandler={e => setPassword(e)}
                isRight={true}
                rightContent={
                  <TouchableOpacity
                    onPress={() => setPassVisible(!passVisible)}
                    style={[{ paddingRight: SW(10) }]}
                  >
                    <MaterialCommunityIcons
                      size={SF(30)}
                      color={''}
                      name={passVisible ? 'eye-outline' : 'eye-off-outline'}
                    />
                  </TouchableOpacity>
                }
                textInputProps={{
                  style: styles.inputStyle,
                }}
              />
              {!passwordRegex.test(password) && passwordError ? (
                <View>
                  <Text style={styles.ErrorMsg}>
                    {translate('errorPasswordMsg')}
                  </Text>
                </View>
              ) : null}

              <Input
                title={translate('Confirm Password')}
                placeholder="Confirm Password"
                showPassword={!conPassVisible}
                value={confirmPassword}
                onChangeHandler={e => setconfirmPassword(e)}
                isRight={true}
                rightContent={
                  <TouchableOpacity
                    onPress={() => setConPassVisible(!conPassVisible)}
                    style={[{ paddingRight: SW(10) }]}
                  >
                    <MaterialCommunityIcons
                      size={SF(30)}
                      color={''}
                      name={conPassVisible ? 'eye-outline' : 'eye-off-outline'}
                    />
                  </TouchableOpacity>
                }
                textInputProps={{
                  style: styles.inputStyle,
                }}
              />
              {confirmPassword === '' && conPasswordError ? (
                <View>
                  <Text style={styles.ErrorMsg}>
                    {translate('Enter confirm password')}
                  </Text>
                </View>
              ) : password !== confirmPassword && conPasswordError ? (
                <View>
                  <Text style={styles.ErrorMsg}>
                    {translate('Passwords does not match')}
                  </Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.singupButtonMain}
                onPress={signUpButton}
              >
                <Text style={styles.singupTextStyle}>
                  {translate('textSingup')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowInfo}>
              <Text style={styles.alreadyHaveAccount}>
                {translate('textHaveAccount')}
              </Text>
              <TouchableOpacity style={styles.loginView} onPress={goToLogin}>
                <Text style={styles.login}>{translate('login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOtpModal}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Verify Signup OTP</Text>
            <OTPInput
              length={6}
              onSubmit={async otp => {
                try {
                  setLoading(true);
                  const result = await dispatch(
                    verifyOtp({
                      email: email,
                      first_name: '',
                      last_name: '',
                      phone_number: phone,
                      address: '',
                      zip_code: '',
                      user_type: 'student',
                      student_class: '',
                      is_active: false,
                      password: password,
                      otp: otp,
                    }),
                  ).unwrap();

                  console.log('OTP Verify Success:', result);
                  Alert.alert('Success', result.message || 'OTP Verified', [
                    {
                      text: 'OK',
                      onPress: () => {
                        onPayment();
                      },
                    },
                  ]);
                } catch (err) {
                  console.error('OTP Verify Error:', err);
                  Alert.alert(
                    'Failed',
                    typeof err === 'string'
                      ? err
                      : err?.message || 'Something went wrong',
                  );
                } finally {
                  setLoading(false);
                }
              }}
            />
          </View>
        </View>
      </Modal>
    </ContainerComponent>
  );
};

export default SignUpScreen;

const themedStyles = colors =>
  StyleSheet.create({
    main: {
      backgroundColor: '',
      flex: 1,
    },
    ContainerStyle: {
      flex: 1,
      paddingHorizontal: SW(20),
      paddingVertical: SH(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoView: {
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text,
    },
    rowInfo: {
      flexDirection: 'row',
      marginLeft: SW(7),
      marginVertical: SH(1),
      marginBottom: SH(2),
      alignItems: 'center',
    },

    inputStyle: {
      fontFamily: Fonts.Medium,
      fontSize: SF(15),
      width: '100%',
      color: colors.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    roleTextStyle: {
      color: 'black',
      marginTop: SH(1),
      fontFamily: Fonts.Regular,
      color: colors.text,
    },
    logoStyle: {
      width: '50%',
    },
    login: {
      color: colors.primary,
      fontFamily: Fonts.Bold,
      fontSize: SF(15),
      // fontFamily: Fonts.Bold,
    },
    loginView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentMainView: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    welcomeTextStyle: {
      fontSize: SF(20),
      fontFamily: Fonts.Bold,
      color: colors.text,
    },
    detailsTextMessageStyle: {
      fontSize: SF(15),
      fontFamily: Fonts.Medium,
      marginTop: SH(1),
      color: colors.text,
    },

    singupButtonMain: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      marginVertical: SH(18),
      borderRadius: SH(10),
    },
    singupTextStyle: {
      color: 'white',
      fontFamily: Fonts.Bold,
      fontSize: SF(15),
      paddingVertical: SH(10),
      color: colors.background,
    },
    alreadyHaveAccount: {
      fontFamily: Fonts.Bold,
      fontSize: SF(15),
      color: colors.text,
    },
    txtTnc: {
      fontFamily: Fonts.Bold,
      color: colors.text,
    },
    countryCodeDrop: {
      flex: 1,
      height: SH(150),
      width: SW(200),
      backgroundColor: 'white',
      borderTopWidth: 0,
      borderRadius: SH(5),
      alignItems: 'center',
      marginTop: SH(0),
      bottom: SH(17),
      position: 'absolute',
      zIndex: 10,
    },
    ErrorMsg: {
      fontSize: SF(12),
      color: 'red',
      marginLeft: SW(1),
    },
    inputStyleForOtp: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },

    loader: {
      position: 'absolute',
      marginTop: SH(40),
      alignSelf: 'center',
      zIndex: 20,
    },
    dropdown: {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderRadius: 10,
    },
    icon: {
      marginRight: 5,
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
    },
    placeholderStyle: {
      fontSize: 16,
      color: colors.text,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: colors.text,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    loaderOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 12,
    },
  });
