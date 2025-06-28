import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation, route }) => {

  const { nextScreen } = route.params || { nextScreen: "HomeScreen" };

  const { sendOTP } = useAuth();

  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const isButtonEnabled = phone.trim() !== "" && agreeTerms && agreePolicy;

  //regex phone
  const phoneRegex = /^0?[35789]\d{8}$/;

  const formatPhoneNumber = (phone) => {

    if (phone.startsWith("0")) {
      return "+84" + phone.slice(1);
    }
    return "+84" + phone;
  }

  const handleContinue = () => {
    if(!phoneRegex.test(phone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      return;
    }
    setModalVisible(true);
  };

  const handleSendOtp = async () => {
    try {

      const formattedPhone = formatPhoneNumber(phone);
      await sendOTP(formattedPhone);
      console.log("Mã OTP đã được gửi đến số điện thoại:", formattedPhone);
      navigation.navigate("VerifyScreen", { phone: formattedPhone, nextScreen });
    
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }

  
  return (
    <View style={styles.container}>

      {/* Header */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Nhập số điện thoại</Text>

      {/* Input Field */}
      <View style={styles.phoneContainer}>
        <View style={styles.countryCodeContainer}>
          <Text style={styles.countryCode}>+84</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          autoFocus={true}
          returnKeyType="done"
        />
      </View>

      {/* Checkboxes */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          color={agreeTerms ? "#007AFF" : undefined}
        />
        <Text style={styles.checkboxText}>
          Tôi đồng ý với các{" "}
          <Text style={styles.link}>điều khoản sử dụng Chat</Text>
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={agreePolicy}
          onValueChange={setAgreePolicy}
          color={agreePolicy ? "#007AFF" : undefined}
        />
        <Text style={styles.checkboxText}>
          Tôi đồng ý với{" "}
          <Text style={styles.link}>điều khoản Mạng xã hội của Chat</Text>
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          { backgroundColor: isButtonEnabled ? "#007AFF" : "#B0C4DE" },
        ]}
        disabled={!isButtonEnabled}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>Tiếp tục</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhận mã xác thực qua số</Text>
            <Text style={styles.modalPhone}>{phone}?</Text>
            <Text style={styles.modalDescription}>
              Chat sẽ gửi mã xác thực cho bạn qua số điện thoại này
            </Text>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                handleSendOtp();
              }}
            >
              <Text style={styles.modalButtonText}>Tiếp tục</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Đổi số khác</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <Text style={styles.footerText}>
        Bạn đã có tài khoản?{" "}
        <Text
          onPress={() => navigation.navigate("LoginScreen")}
          style={styles.link}
        >
          Đăng nhập ngay
        </Text>
      </Text>
      
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
    marginBottom: height * 0.04,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.03,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  countryCodeContainer: {
    width: width * 0.17,
    height: height * 0.05,
    backgroundColor: "#D2E0FB",
    borderColor: "#007AFF",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  countryCode: {
    fontSize: height * 0.02,
  },
  input: {
    flex: 1,
    fontSize: height * 0.02,
    paddingHorizontal: 15,
    borderTopWidth: 1.2,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#007AFF",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.01,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: height * 0.018,
  },
  link: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  continueButton: {
    padding: height * 0.015,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.04,
  },
  continueText: {
    color: "white",
    fontSize: height * 0.022,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: height * 0.05,
    fontSize: height * 0.02,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "77%",
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  modalPhone: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 19,
    marginBottom: 15,
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D9D9D9",
    color: "gray",
  },
  modalButtonText: {
    color: "#007AFF",
    fontSize: 19,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 19,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
