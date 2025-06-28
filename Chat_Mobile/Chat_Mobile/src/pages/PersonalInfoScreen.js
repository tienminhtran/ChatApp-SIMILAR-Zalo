import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const PersonalInfoScreen = ({ navigation, route }) => {
  const { phone, name } = route.params;
  const [birthDate, setBirthDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [gender, setGender] = useState(null);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isValid =
    birthDate && gender && password.length >= 8 && password === confirmPassword;

  const handleConfirm = (date) => {
    setBirthDate(date.toISOString().split("T")[0]);
    setDatePickerVisibility(false);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (confirmPassword && text !== confirmPassword) {
      setPasswordError("Mật khẩu không khớp");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setPasswordError("Mật khẩu không khớp");
    } else {
      setPasswordError("");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("NameRegisterScreen")}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Thêm thông tin cá nhân và mật khẩu</Text>

      {/* Chọn ngày sinh */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setDatePickerVisibility(true)}
      >
        <Text style={[styles.inputText, !birthDate && styles.placeholder]}>
          {birthDate || "Sinh nhật"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="gray" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        display="default"
        maximumDate={new Date()}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      {/* Chọn giới tính */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowGenderModal(true)}
      >
        <Text style={[styles.inputText, !gender && styles.placeholder]}>
          {gender || "Giới tính"}
        </Text>
        <Ionicons name="chevron-down-outline" size={20} color="gray" />
      </TouchableOpacity>

      {/* Nhập mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Nhập lại mật khẩu */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {/* Nút tiếp tục */}
      <TouchableOpacity
        onPress={() => navigation.navigate("AvatarScreen", { phone, name, gender, birthDate, password })}
        style={[styles.button, !isValid && styles.buttonDisabled]}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>

      {/* Modal chọn giới tính */}
      <Modal visible={showGenderModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setGender("Nam");
                setShowGenderModal(false);
              }}
            >
              <Text style={styles.modalText}>Nam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setGender("Nữ");
                setShowGenderModal(false);
              }}
            >
              <Text style={styles.modalText}>Nữ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                setGender("Khác");
                setShowGenderModal(false);
              }}
            >
              <Text style={styles.modalText}>Khác</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.modalCancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9FF",
    padding: height * 0.03,
    paddingTop: height * 0.06,
  },
  backButton: {
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: height * 0.03,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.04,
  },
  input: {
    backgroundColor: "white",
    padding: height * 0.014,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  inputText: {
    fontSize: height * 0.018,
    color: "black",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: height * 0.002,
    paddingHorizontal: height * 0.01,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: height * 0.02,
  },
  passwordInput: {
    flex: 1,
    fontSize: height * 0.018,
    color: "black",
  },
  placeholder: {
    color: "gray",
  },
  inputPassword: {
    backgroundColor: "white",
    padding: height * 0.014,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: height * 0.018,
    marginBottom: height * 0.02,
  },
  errorText: {
    fontWeight: "bold",
    color: "red",
    fontSize: height * 0.018,
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: height * 0.018,
    borderRadius: 30,
    alignItems: "center",
    marginTop: height * 0.05,
  },
  buttonDisabled: {
    backgroundColor: "#B0C4DE",
  },
  buttonText: {
    color: "white",
    fontSize: height * 0.02,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  modalText: {
    fontSize: height * 0.02,
  },
  modalCancel: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  modalCancelText: {
    fontSize: height * 0.018,
    color: "red",
  },
});

export default PersonalInfoScreen;
