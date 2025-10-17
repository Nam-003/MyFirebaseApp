import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Import styles
import { globalStyles } from "../styles/globalStyles"; // Đảm bảo import này chính xác

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        console.log("User account created & signed in!", userCredentials.user);
        // Tạo một document trong Firestore để lưu thông tin thêm
        firestore()
          .collection("users")
          .doc(userCredentials.user.uid)
          .set({
            email: userCredentials.user.email,
            phone: "",
            address: "",
          })
          .then(() => {
            console.log("User added to Firestore!");
          });
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Đăng ký thất bại", "Địa chỉ email này đã được sử dụng!");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Đăng ký thất bại", "Địa chỉ email không hợp lệ!");
        } else {
          Alert.alert("Đăng ký thất bại", error.message);
        }
      });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Đăng ký tài khoản</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Mật khẩu (ít nhất 6 ký tự)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={globalStyles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={globalStyles.buttonText}>Đăng ký</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={globalStyles.linkText}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
