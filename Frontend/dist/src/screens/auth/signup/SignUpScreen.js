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
import Entypo from 'react-native-vector-icons/Entypo';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreateOrder,
  getClassNames,
  paymentVerify,
  reSendOtp,
  signUpAction,
  verifyOtp,
} from '../../../redux/reducer/authReducer';
import OTPInput from '../../../components/commonComponents/OTPInput';
import Colors, { darkColors, lightColors } from '../../../utils/Colors';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({ navigation }) => {
  const themeMode = useSelector(state => state.theme.theme);
  let colors = themeMode === 'dark' ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneerror] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [nameError, setnameError] = useState(false);
  const [emailerror, setEmailerror] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [sectionError, setSectionError] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState('');
  const [conPassVisible, setConPassVisible] = useState(false);
  const [conPasswordError, setconfirmPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [price, setPrice] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSuccessPopup, setOtpSuccessPopup] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const dispatch = useDispatch();
  const getClassData = useSelector(state => state.auth.getClassData);
  const orderId = useSelector(state => state.auth.orderId);
  const [btnLoading, setBtnLoading] = useState(false);
  console.log(orderId, "================orderId==")
  const [razorpay_order_id, setrazorpay_order_id] = useState(orderId)
  const [deviceToken, setDeviceToken] = useState('');
  const nameRegex = /^[a-zA-Z]+( [a-zA-z]+)*$/;
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    dispatch(getClassNames());
    //getFCMToken()
  }, [dispatch]);
  const tok = async () => {
    let refresh = await AsyncStorage.getItem('refresh_token')
    let access = await AsyncStorage.getItem('access_token')
    let isPaid = await AsyncStorage.getItem('isPaid')
  let stent =  await AsyncStorage.getItem("studentId", String(result?.data?.student_id))
  const classId =  await AsyncStorage.getItem("classId",String(result?.data?.class_id))
    console.log(access, "=====acess===",stent)
    console.log(isPaid, "=====isPaid=====",classId)
    if (isPaid == 'false') {
      setOtpSuccessPopup(true)
    }
  }
  useEffect(() => {
    tok()
  }, []);
  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const signUpButton = async () => {
    // onPayment()
    setnameError(true);
    setPhoneerror(true);
    setPasswordError(true);
    setSectionError(true);
    setconfirmPasswordError(true);
    if (email !== '') {
      setEmailerror(true);
    }
    console.log(password, confirmPassword)
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
            class_id: value,
            is_active: false,
            password: password,
            confirm_password: confirmPassword
          }),
        ).unwrap();

          console.log('Signup Success:', result);
        Alert.alert('Success', result?.message || 'OTP Verified', [
          {
            text: 'OK',
            onPress: () => setShowOtpModal(true),
          },
        ]);
        //  Alert.alert('Success', result.message);
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
            color={colors.background}
            name={'keyboard-arrow-down'}
          />
        )}
      </View>
    );
  };
  console.log('value', value, 'amount', price);

  const handleContinue = async () => {
    try {
      setBtnLoading(true); // show loader inside button

      const result = await dispatch(
        CreateOrder({
          class_id: value ||3,
          price: price || 3000,//parseInt(item.amount, 10)
        })
      );

      if (CreateOrder.fulfilled.match(result)) {
        const newOrderId = result.payload?.data?.id;
        setrazorpay_order_id(newOrderId);
        await onPayment(newOrderId); // pass fresh orderId
         setOtpSuccessPopup(false)
      } else {
        Alert.alert('Failed', 'Could not create order, please try again');
      }
    } catch (err) {
      Alert.alert('Error', err?.message || 'Something went wrong');
    } finally {
      setBtnLoading(false); // hide loader
    }
  };

  const onPayment = async (orderIdParam) => {
    const finalOrderId = orderIdParam || razorpay_order_id;
    console.log(finalOrderId, "finalOrderId=====", razorpay_order_id, "razorpay_order_id", orderIdParam, "orderIdParam ")
    try {
      setLoading(true); 

      let options = {
        description: 'Credits towards consultation',
        currency: 'INR',
        key: 'rzp_test_nfY709knHa5l4u',
        amount: price,
        name: fullName || 'User',
        order_id: finalOrderId,
        prefill: {
          email,
          contact: phone,
          name: fullName,
        },
        theme: { color: colors.primary },
      };

      RazorpayCheckout.open(options)
        .then(async data => {
          try {
            const result = await dispatch(
              paymentVerify({
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_order_id: finalOrderId,
                razorpay_signature: data.razorpay_signature,
              })
            ).unwrap();
    if (result.message_type === "success") {
  await AsyncStorage.setItem("studentId", String(result?.data?.student_id));
  await AsyncStorage.setItem("classId", String(result?.data?.classId_id));
    setOtpSuccessPopup(false)
            console.log("Payment Verify :", result);
          // await AsyncStorage.setItem("studentId",result?.data?.student_id.toString())
          // await AsyncStorage.setItem("classId",result?.data?.class_id.toString())
  navigation.navigate('BottomTabNavigations');

  console.log("✅ Stored successfully");
}

          
            Alert.alert(
              "Payment Verification",
              result?.message || "Payment verified successfully", [
              {
                text: 'OK',
                onPress: () => {
                  setOtpSuccessPopup(false)
                  navigation.navigate('BottomTabNavigations');
                },
              },
            ],
            );
          
          } catch (verifyErr) {
            console.error("Verify Failed:", verifyErr);
            Alert.alert("Payment Failed", verifyErr?.message || "Verification failed", [
              {
                text: 'OK',
                onPress: () => {
                  setOtpSuccessPopup(true)
                },
              },
            ],);
          } finally {
            setLoading(false);
          }
        })
        .catch(error => {
          setLoading(false);
          Alert.alert('Payment Failed', `${error.code} | ${error.description}`);
          console.error("Razorpay error:", error);
        });
    } catch (err) {
      setLoading(false);
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

              <Text style={{ fontSize: SF(15), marginTop: SH(5),color:colors.text }}>Class</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={getClassData}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder="Select item"
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => {
                  dispatch(getClassNames());
                }}
                onChange={item => {
                  setValue(item.id);
                  setPrice(parseInt(item.amount, 10));
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
                      color={colors.text}
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
                     color={colors.text}
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
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.title}>Verify Signup OTP</Text>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <Entypo size={SF(30)} color={colors.text} name={'cross'} />
              </TouchableOpacity>
            </View>

            <OTPInput
              length={6}
              onSubmit={async otp => {
                //console.log('OTP from child:', otp);
                try {
                  setLoading(true)
                  const result = await dispatch(
                    verifyOtp({
                      email: email,
                      phone_number: phone,
                      first_name: fullName,
                      last_name: '',
                      address: '',
                      zip_code: '',
                      user_type: 'student',
                      class_id: value,
                      is_active: false,
                      password: password,
                      otp: otp, // use entered otp instead of hardcoded
                    }),
                  );

                  if (verifyOtp.fulfilled.match(result)) {
                  console.log('Success:', result.payload);
                    await AsyncStorage.setItem("refresh_token", result.payload.data.refresh)
                    await AsyncStorage.setItem("access_token", result.payload.data.access)
                    await AsyncStorage.setItem("isPaid", JSON.stringify(result.payload.data.is_paid))
                    setOtpMessage(result.payload.message);
                    setShowOtpModal(false)
                    Alert.alert(
                      'Success',
                      result.payload.message || 'OTP Verified',
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            setOtpSuccessPopup(true)
                            setShowOtpModal(false)
                          },
                        },
                      ],
                    );
                  } else if (verifyOtp.rejected.match(result)) {
                    console.log('Error:', result.payload);
                    Alert.alert(
                      'Error',
                      result.payload?.message || 'OTP verification failed',
                    );
                  }
                } catch (error) {
                  // console.log('Exception:', error);
                  Alert.alert(
                    'Error',
                    'Something went wrong. Please try again.',
                  );
                }finally{
                  setLoading(false)
                }
              }}
              onResend={() => {
               // console.log('🔄 Resend clicked');
                dispatch(
                  reSendOtp({
                    phone_number: phone,
                  }),
                );
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={otpSuccessPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setOtpSuccessPopup(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.successModalContent}>
            <Text style={styles.successTitle}>Success</Text>
            <Text style={styles.successMessage}>{otpMessage}</Text>
            <Text style={styles.successMessage}>
              Click continue to complete payment
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              disabled={btnLoading}>
              {btnLoading ? (
                <ActivityIndicator color="#fff" /> 
              ) : (
                <Text style={styles.continueText}>Continue</Text>
              )}
            </TouchableOpacity>
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
    //  backgroundColor: '',
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
      borderColor:colors.text,
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
      color:colors.text
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
      backgroundColor:colors.background,
      padding: 20,
      borderRadius: 12,
    },
    successModalContent: {
      width: '85%',
      backgroundColor: 'white',
      padding: 25,
      borderRadius: 12,
      alignItems: 'center',
    },
    successTitle: {
      fontSize: 20,
      fontFamily: Fonts.Bold,
      color: 'green',
      marginBottom: 2,
    },
    successMessage: {
      fontSize: 16,
      fontFamily: Fonts.Medium,
      color: '#333',
      textAlign: 'center',
      marginVertical: 1,
    },
    continueButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 8,
      marginTop: 10,
    },
    continueText: {
      fontSize: 16,
      fontFamily: Fonts.Bold,
      color: '#fff',
    },
  });
