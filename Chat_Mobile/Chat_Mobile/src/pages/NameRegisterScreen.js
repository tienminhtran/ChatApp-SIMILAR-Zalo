import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const NameRegisterScreen = ({ navigation, route }) => {
  const { phone } = route.params || { phone: "" };
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isValid = name.length >= 2 && name.length <= 40 && !/[0-9]/.test(name);

  const inputRef = useRef(null);

  // Tự động focus khi vào màn hình
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập tên người dùng</Text>
      <Text style={styles.subtitle}>
        Hãy dùng tên thật để mọi người dễ nhận ra bạn
      </Text>

      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          { borderColor: isFocused ? "#007AFF" : "#ccc" }, // Đổi màu border khi focus
        ]}
        placeholder="Nguyễn Văn A"
        value={name}
        onChangeText={setName}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <View style={styles.rulesContainer}>
        <Text style={styles.rule}>● Dài từ 2 đến 40 ký tự</Text>
        <Text style={styles.rule}>● Không chứa số</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        disabled={!isValid}
        onPress={() => navigation.navigate("PersonalInfoScreen", { phone, name })}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: height * 0.03,
    paddingTop: height * 0.1,
    // marginTop: height * 0.06,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginVertical: height * 0.02,
    fontSize: height * 0.017,
    textAlign: "center",
    color: "gray",
    marginBottom: height * 0.04,
  },
  input: {
    backgroundColor: "white",
    padding: height * 0.016,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: height * 0.018,
  },
  rulesContainer: {
    marginTop: height * 0.018,
  },
  rule: {
    fontSize: height * 0.015,
    color: "gray",
    marginBottom: height * 0.005,
  },
  link: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: height * 0.015,
    borderRadius: 30,
    marginTop: height * 0.05,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#B0C4DE",
  },
  buttonText: {
    color: "white",
    fontSize: height * 0.02,
    fontWeight: "bold",
  },
});

export default NameRegisterScreen;
