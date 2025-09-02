import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Input from '../../../components/commonComponents/Input';
import { checkEmailValidation } from '../../../utils/utils';
import ContainerComponent from '../../../components/commonComponents/Container';
import { translate } from '../../../utils/config/i18n';
import { SH, SW, SF } from '../../../utils/dimensions';
import OTPInput from '../../../components/commonComponents/OTPInput';
import Fonts from '../../../utils/Fonts';
import { sendOtpPassword, verifyOtp } from '../../../redux/reducer/authReducer';
import { useDispatch } from 'react-redux';

const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();
    const [phone, setPhone] = useState('');
      const [phoneError, setPhoneerror] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  const sendOtp = async () => {
    setPhoneerror(true);
    navigation.navigate('CreatePassword', { email });
    if (phoneRegex.test(phone)) {
      let send = await dispatch(sendOtpPassword({ user: phone }));

      console.log('FULL RESPONSE:', send);
 setShowOtpModal(true);
      if (send?.payload?.status_type === 'success') {
        console.log(send?.payload?.message || 'OTP sent successfully');
        Alert.alert(send?.payload?.message || 'OTP sent successfully')
        setShowOtpModal(true);
      } else {
        console.log('OTP sending failed');
        Alert.alert('Error', send?.payload?.message || 'Something went wrong');
      }
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
        <View
          style={{
            flex: 1,
            paddingHorizontal: SW(20),
            paddingVertical: SH(20),
            //  justifyContent: 'center',
            // alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: SF(20), textAlign: 'center' }}>
            Forgot Password
          </Text>
          <Text style={{ fontSize: SF(15), marginTop: SH(15) }}>
            Do you forgot your password please! enter your phone number
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

          <TouchableOpacity style={styles.singupButtonMain} onPress={sendOtp}>
            <Text style={styles.singupTextStyle}>{translate('Send OTP')}</Text>
          </TouchableOpacity>
        </View>
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
                console.log('✅ OTP from child:', otp);
                try {
                  const result = await dispatch(
                    verifyOtp({
                      email: email,
                      phone_number: phone,
                      first_name:'',
                      last_name: '',
                      address: '',
                      zip_code: '',
                      user_type: '',
                      student_class: '',
                      is_active: '',
                      password:'',
                      otp: otp, // use entered otp instead of hardcoded
                    }),
                  );

                  if (verifyOtp.fulfilled.match(result)) {
                    console.log('Success:', result.payload);
                    setOtpMessage(result.payload.message);
                    Alert.alert(
                      'Success',
                      result.payload.message || 'OTP Verified',
                      [
                        {
                          text: 'OK',
                          onPress: () => setOtpSuccessPopup(true),
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
                  console.log('Exception:', error);
                  Alert.alert(
                    'Error',
                    'Something went wrong. Please try again.',
                  );
                }
              }}
              onResend={() => {
                console.log('🔄 Resend clicked');
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
    </ContainerComponent>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: Fonts.Medium,
    fontSize: SF(15),
    width: '100%',
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
  singupButtonMain: {
    backgroundColor: '#1976D2',
    alignItems: 'center',
    marginVertical: SH(18),
    borderRadius: SH(10),
  },
  singupTextStyle: {
    color: 'white',
    fontFamily: Fonts.Bold,
    fontSize: SF(15),
    paddingVertical: SH(10),
  },
  ErrorMsg: {
    fontSize: SF(12),
    color: 'red',
    marginLeft: SW(1),
  },
});
