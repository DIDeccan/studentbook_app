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
  const [email, setEmail] = useState('');
  const [emailerror, setEmailerror] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const sendOtp = async () => {
    setEmailerror(true);
   // navigation.navigate('CreatePassword', { email });
    if (checkEmailValidation(email) && email !== '') {
      let send = await dispatch(sendOtpPassword({ user: email }));

      console.log('FULL RESPONSE:', send);

      if (send?.payload?.statusCode === 200) {
        console.log('OTP sent successfully');
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
            Do you forgot your password please! enter your email address
          </Text>
          <Input
            keyboardType="email-address"
            title={translate('Email')}
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
                try {
                  let response = await dispatch(
                    verifyOtp({
                      email:'',
                      first_name:'',
                      last_name:'',
                      phone_number:email,
                      address:'',
                      zip_code:'',
                      user_type:'',
                      student_class:"",
                      is_active:"",
                      password:'',
                      otp:otp,
                    }),
                  );

                  //console.log(response, "=========verifyOtp====");
                  if (response?.payload?.status === 200) {
                    Alert.alert(
                      'Success',
                      response?.payload?.message || 'OTP Verified',
                    );
                  } else {
                    Alert.alert(
                      'Failed',
                      response?.payload?.message || 'Invalid OTP, try again.',
                    );
                  }
                } catch (error) {
                  console.error('Error in OTP verification:', error);
                  Alert.alert(
                    'Error',
                    'Something went wrong, please try again.',
                  );
                }
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
