import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";

const OTPInput = ({ length = 6, onSubmit, onResend }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30); // cooldown timer
  const inputs = useRef([]);

  // Auto countdown for resend
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle change (digit by digit OR full OTP paste/auto-fill)
  const handleChange = (text, index) => {
    if (/[^0-9]/.test(text)) return; // allow only numbers

    //  If user pastes full OTP at once
    if (text.length > 1) {
      const otpArray = text.split("").slice(0, length);
      setOtp(otpArray);
      inputs.current[length - 1]?.focus();
      return;
    }

    // ✅ Normal manual digit entry
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError("");

    // Move to next input
    if (text && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerify = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < length) {
      setError(`Please enter ${length}-digit OTP`);
      return;
    }
    setError("");
    onSubmit(finalOtp);
  };

  // Resend OTP
  const handleResend = () => {
    setTimer(30);
    setOtp(Array(length).fill(""));
    inputs.current[0]?.focus();
    onResend();
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.input, error ? styles.errorInput : null]}
            keyboardType="numeric"
            maxLength={length} // 👈 allows paste of full OTP
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Resend OTP Section */}
      <View style={{ marginTop: 15, flexDirection: "row" }}>
        <Text style={{ fontSize: 14, color: "#555" }}>Didn't get OTP? </Text>
        {timer === 0 ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={{ color: "#007bff", fontWeight: "600" }}>Resend</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: "#999" }}>Resend in {timer}s</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 45,
    height: 55,
    margin: 5,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OTPInput;
