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
import { reSendOtp, resetPassword, sendOtpPassword, verifyOtp1} from '../../../redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from "axios";

const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneerror] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const { loading } = useSelector((state) => state.auth)
  const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  const sendOtp = async () => {
    setPhoneerror(true);
    if (phoneRegex.test(phone)) {
      let send = await dispatch(sendOtpPassword({ user: phone }));
if (sendOtpPassword.fulfilled.match(send)) {
  console.log(" OTP sent:", send.payload);
  Alert.alert(send.payload.message || "OTP sent successfully");
  setShowOtpModal(true);
} else {
  console.log("OTP failed:", send.payload);
  Alert.alert("Error", send.payload?.message || "Something went wrong");
}

      // console.log('FULL RESPONSE:', send);
      // setShowOtpModal(true);
      // if (send?.payload?.status_type === 'success') {
      //   console.log(send?.payload?.message || 'OTP sent successfully');
      //   Alert.alert(send?.payload?.message || 'OTP sent successfully')
      //   setShowOtpModal(true);
      // } else {
      //   console.log('OTP sending failed');
      //   Alert.alert('Error', send?.payload?.message || 'Something went wrong');
      // }
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
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.title}>Verify Signup OTP</Text>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <Entypo size={SF(30)} color={''} name={'cross'} />
              </TouchableOpacity>
            </View>
            <OTPInput
              length={6}
        onSubmit={async(otp)=>{
             console.log(phone,"phone", otp,"opt")
             console.log("Hiii5")
      try {
 
    const result = await dispatch(
      verifyOtp1({ user: phone, otp })
    );
  console.log("Hiii22")

    if (verifyOtp1.fulfilled.match(result)) {
      console.log("Success:", result.payload);
      Alert.alert(
        "Success",
        result.payload.message || "OTP Verified",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("CreatePassword", { phone }),
          },
        ]
      );
    } else {
      console.log("Error:", result.payload);
      Alert.alert(
        "Error",
        result.payload?.message || "OTP verification failed"
      );
    }
  } finally {

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
