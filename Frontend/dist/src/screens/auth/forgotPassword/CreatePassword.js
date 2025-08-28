import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import ContainerComponent from '../../../components/commonComponents/Container';
import Input from '../../../components/commonComponents/Input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SF, SH, SW } from '../../../utils/dimensions';
import { translate } from '../../../utils/config/i18n';
import Fonts from '../../../utils/Fonts';
import { resetPassword } from '../../../redux/reducer/authReducer';
import { useDispatch } from 'react-redux';

const CreatePassword = props => {
    const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [passVisible, setPassVisible] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState('');
  const [conPassVisible, setConPassVisible] = useState(false);
  const [conPasswordError, setconfirmPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  let email = props.route.params.email;
  let otp = props.route.params.email;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const CountinueBtn = async () => {
  // props.navigation.navigate("LoginScreen");
  setPasswordError(true);
  setconfirmPasswordError(true);

  if (passwordRegex.test(password) && passwordRegex.test(confirmPassword)) {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    let reset = await dispatch(
      resetPassword({
        email: email,
        otp: otp,
        new_password: password,
        confirm_new_password: confirmPassword,
      })
    );

    console.log("RESET RESPONSE:", reset);

    if (reset?.payload?.statusCode === 200) {
      Alert.alert(
        "Success",
        reset?.payload?.message || "Password changed successfully",
        [
          {
            text: "OK",
            onPress: () => {
              props.navigation.navigate("LoginScreen");
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Error",
        reset?.payload?.message || "Something went wrong, please try again."
      );
    }
  }
};

  return (
    <ContainerComponent>
      <Text
        style={{ textAlign: 'center', fontSize: SF(20), paddingTop: SH(13) }}
      >
        Create Password
      </Text>
      <View
        style={{ flex: 1, paddingHorizontal: SW(16), justifyContent: 'center' }}
      >
        <Input
          title={translate('Enter new password')}
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
            <Text style={styles.ErrorMsg}>{translate('errorPasswordMsg')}</Text>
          </View>
        ) : null}

        <Input
          title={translate('Enter confirm new password')}
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
          onPress={CountinueBtn}
        >
          <Text style={styles.singupTextStyle}>{translate('Continue')}</Text>
        </TouchableOpacity>
      </View>
    </ContainerComponent>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  ErrorMsg: {
    fontSize: SF(12),
    color: 'red',
    marginLeft: SW(1),
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
});
