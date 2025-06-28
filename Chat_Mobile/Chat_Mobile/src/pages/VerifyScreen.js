import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

const { width, height } = Dimensions.get("window");

const VerifyScreen = ({ navigation, route }) => {
  const { phone, nextScreen } = route.params || { phone: "0862 058 920" };
  // console.log("Screen từ VerifyScreen:", nextScreen);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputs = useRef([]);

  const { verify, isLoading } = useAuth();

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus(); // Tự động focus vào ô đầu tiên
    }
  }, []);

  const handleChange = (text, index) => {
    let newOtp = [...otp];

    if (text.length > 1) {
      text = text[text.length - 1];
    }
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    if (text === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const getOtpValue = () => otp.join("");

  const handleContinue = async () => {
    const enteredOtp = getOtpValue();
    console.log(" Mã OTP đã nhập:", enteredOtp);

    if (enteredOtp.length === 6) {
      // alert(`Xác thực OTP thành công: ${enteredOtp}`);
      try {
        

        console.log("Xác thực OTP với số điện thoại:", phone, "và mã OTP:", enteredOtp);
        const response = await verify(phone, enteredOtp);

        Alert.alert("Xác thực thành công", response.message, [{ text: "OK" }]);
        switch (nextScreen) {
          case "HomeScreen":
            navigation.replace("NameRegisterScreen", { phone: phone });
            break;
          case "LoginScreen":
            navigation.replace("ResetPasswordScreen", { phone: phone });
            break;
        }   
      
      } catch (error) {
        Alert.alert("Lỗi",  error?.response?.data?.message || error?.message, [{ text: "OK" }]);
      }
    } else {
      alert("Vui lòng nhập đủ 6 số OTP!");
    }
  };

  const isButtonEnabled = otp.every((digit) => digit !== "");

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Nhập mã xác thực</Text>
      <Text style={styles.subtitle}>
        Nhập dãy 6 số được gửi đến số điện thoại
      </Text>
      <Text style={styles.phoneNumber}>{phone}</Text>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            style={[
              styles.otpInput,
              { borderColor: focusedIndex === index ? "#007AFF" : "#ccc" },
            ]}
            ref={(ref) => (inputs.current[index] = ref)}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
          />
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: isButtonEnabled ? "#007AFF" : "#B0C4DE" },
        ]}
        disabled={!isButtonEnabled}
        onPress={() => handleContinue()}
      >
        <Text style={styles.continueText}>Tiếp tục</Text>
      </TouchableOpacity>
      <Loading isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: width * 0.05,
    paddingTop: height * 0.06,
  },
  backButton: {
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: height * 0.02,
    textAlign: "center",
    marginTop: height * 0.02,
  },
  phoneNumber: {
    fontSize: height * 0.022,
    fontWeight: "bold",
    textAlign: "center",
  },
  otpContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: height * 0.03,
  },
  otpInput: {
    width: width * 0.12,
    height: width * 0.13,
    borderRadius: 10,
    borderWidth: 2,
    textAlign: "center",
    fontSize: height * 0.03,
  },
  continueButton: {
    paddingVertical: height * 0.015,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.01,
  },
  continueText: {
    color: "white",
    fontSize: height * 0.022,
    fontWeight: "bold",
  },
});

export default VerifyScreen;
