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

// Import styles
import { globalStyles } from "../styles/globalStyles"; // Đảm bảo import này chính xác

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        console.log("User signed in!", userCredentials.user);
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Đăng nhập thất bại", error.message);
      });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Đăng nhập</Text>
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
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={globalStyles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={globalStyles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={globalStyles.linkText}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}
