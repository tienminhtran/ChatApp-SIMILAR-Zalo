import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { resetPassword } from "../api/authApi";

const { width, height } = Dimensions.get("window");
const ChangePasswordScreen = ({ navigation, route }) => {
  const { phone } = route.params;
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text !== newPassword) {
      setPasswordError("Mật khẩu không khớp");
    } else {
      setPasswordError("");
    }
  };

  const handleChangePassword =  async () => {
    

    try {
        if ( !newPassword || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }
        const response = await resetPassword(phone, newPassword);
        if (response) {
            Alert.alert("Thành công", "Mật khẩu đã được thay đổi");
            navigation.navigate("LoginScreen");
        }
    } catch (error) {
      console.error("Đổi mật khẩu thất bại:", error);
      Alert.alert("Lỗi", "Đổi mật khẩu thất bại. Vui lòng thử lại.");
      return;
    }

    // TODO: Gọi API đổi mật khẩu ở đây
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: height * 0.02,
          }}
        >
          Mật khẩu phải 8 ký tự trở lên
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu mới"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showText}>{showPassword ? "ẨN" : "HIỆN"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Xác nhận mật khẩu"
            secureTextEntry={!showconfirmPassword}
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showconfirmPassword)}
          >
            <Text style={styles.showText}>
              {showconfirmPassword ? "ẨN" : "HIỆN"}
            </Text>
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordContainer: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: height * 0.015,
    fontSize: height * 0.02,
  },
  errorText: {
    fontWeight: "bold",
    color: "red",
    fontSize: height * 0.018,
    marginBottom: height * 0.02,
    textAlign: "center",
  },
});

export default ChangePasswordScreen;
