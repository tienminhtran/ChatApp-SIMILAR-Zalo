import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { signUp } from "../api/authApi";
import { storeToken, storeRefreshToken } from "../utils/authHelper";

const { width, height } = Dimensions.get("window");

const AvatarScreen = ({ navigation, route }) => {
  const { phone, name, gender, birthDate, password  } = route.params;

  const [avatar, setAvatar] = useState(null); // Avatar mặc định là null
  const initials = "LT"; // Chữ viết tắt

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];

      setAvatar({
        uri: img.uri,
        name: img.fileName || "avatar.jpg",
        type: "image/jpeg",
      });
    }
  };

  // Hàm đăng ký tài khoản
  const handleSignUp = async () => {
    
    const params = { 
        phone, 
        display_name: name, 
        gender, 
        dob: birthDate, 
        password,
    };
    console.log("Đang đăng ký với thông tin:", params);

    const formData = new FormData();

    // Thêm thông tin vào formData
    formData.append(
      "signUpRequest",
      JSON.stringify(params), "application/json" 
    );

    // Nếu có avatar thì thêm vào formData
    if (avatar) {
      formData.append("avatar", avatar);
    }
    try {
      const response = await signUp(formData);

      if (response.status === "SUCCESS") {
        navigation.navigate("LoginScreen", { phoneLogin: phone, passwordLogin: password });
        Alert.alert("Đăng ký thành công", "Vui lòng đăng nhập để tiếp tục.");
      }
    } catch (error) {
      console.log("Sign up error:", error);
      Alert.alert("Đăng ký thất bại", error?.response?.data?.message || error?.message, [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật ảnh đại diện</Text>
      <Text style={styles.subtitle}>
        Đặt ảnh đại diện để mọi người dễ nhận ra bạn
      </Text>

      {/* Avatar */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar.uri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Nút cập nhật */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {handleSignUp()}}
      >
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>

      {/* Nút bỏ qua */}
      <TouchableOpacity disabled={!!avatar} onPress={() => { console.log("Đang cập nhật"); handleSignUp()}}>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9FF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.1,
  },
  title: {
    fontSize: height * 0.025,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: height * 0.018,
    color: "gray",
    textAlign: "center",
    marginBottom: height * 0.05,
  },
  avatarContainer: {
    marginBottom: height * 0.05,
  },
  avatar: {
    width: height * 0.1,
    height: height * 0.1,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: height * 0.15,
    height: height * 0.15,
    borderRadius: height * 0.1,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: height * 0.04,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: height * 0.015,
    paddingHorizontal: height * 0.15,
    borderRadius: height * 0.1,
    alignItems: "center",
    marginTop: height * 0.4,
    marginBottom: height * 0.03,
  },
  buttonText: {
    color: "white",
    fontSize: height * 0.02,
    fontWeight: "bold",
  },
  skipText: {
    fontSize: height * 0.02,
    fontWeight: "bold",
  },
});

export default AvatarScreen;
