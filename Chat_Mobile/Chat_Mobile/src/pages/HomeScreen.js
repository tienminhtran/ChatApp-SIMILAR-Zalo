import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
const {removeToken} = require("../utils/authHelper");

const { width, height } = Dimensions.get("window");
const ZaloLoginScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      {/* Logo Zalo */}
      <Text style={styles.logo}>Chat</Text>

      {/* Hình ảnh minh họa */}
      <Image
        source={require("../../assets/images/bg_city.png")}
        style={styles.image}
      />

      <View style={{ marginVertical: 20 }}>
        {/* Tiêu đề */}
        <Text style={styles.title}>Chat tiện ích</Text>
        <Text style={styles.subtitle}>
          Nơi cùng nhau trao đổi thông tin, chia sẻ hình ảnh và video, gửi tin
          nhắn, gọi video và voice call miễn phí.
        </Text>
      </View>

      {/* Nút đăng nhập và tạo tài khoản */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {navigation.navigate("LoginScreen")}}
      >
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("RegisterScreen", {nextScreen: "HomeScreen"})}
      >
        <Text style={styles.registerText}>Tạo tài khoản mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    flex: 0.3,
    fontSize: 42,
    fontWeight: "bold",
    color: "#007AFF",
  },
  image: {
    height: 250,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginHorizontal: 40,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    marginTop: 30,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#EAEAEA",
    paddingVertical: 12,
    paddingHorizontal: width * 0.25,
    borderRadius: 25,
    marginTop: 25,
  },
  registerText: {
    color: "#333",
    fontSize: 16,
  },
});

export default ZaloLoginScreen;
