import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { EmailAuthProvider } from "@react-native-firebase/auth";

// Import styles
import { globalStyles } from "../styles/globalStyles";

export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  // Đã xóa state newEmail
  const [newPassword, setNewPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // State for re-authentication
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionToRetry, setActionToRetry] = useState(null);

  // Lấy thông tin người dùng khi component được mount
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      // Lấy thông tin thêm từ Firestore
      firestore()
        .collection("users")
        .doc(currentUser.uid)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data();
            setPhone(userData.phone || "");
            setAddress(userData.address || "");
          }
        });
    }
  }, []);

  const reauthenticate = () => {
    if (!user || !currentPassword)
      return Promise.reject(new Error("Mật khẩu không được để trống"));
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return auth().currentUser.reauthenticateWithCredential(credential);
  };

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let updated = false;

      // Đã xóa logic cập nhật Email

      // 1. Cập nhật Mật khẩu (nếu có)
      if (newPassword.trim()) {
        await auth().currentUser.updatePassword(newPassword.trim());
        updated = true;
      }

      // 2. Cập nhật SĐT và Địa chỉ trong Firestore
      if (phone.trim() || address.trim()) {
        await firestore().collection("users").doc(user.uid).set(
          {
            phone: phone.trim(),
            address: address.trim(),
          },
          { merge: true }
        );
        updated = true;
      }

      setLoading(false);
      if (updated) {
        Alert.alert("Thành công", "Thông tin của bạn đã được cập nhật.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Thông báo", "Không có thông tin nào được thay đổi.");
      }
    } catch (error) {
      setLoading(false);
      console.error(JSON.stringify(error));
      // Xử lý lỗi cần xác thực lại
      if (error.code === "auth/requires-recent-login") {
        setActionToRetry(() => () => handleUpdate());
        setModalVisible(true);
      } else {
        Alert.alert("Lỗi", error.message);
      }
    }
  };

  const onReauthSuccess = async () => {
    setModalVisible(false);
    setCurrentPassword("");
    if (actionToRetry) {
      await actionToRetry();
    }
    setActionToRetry(null);
  };

  const handleReauthSubmit = () => {
    if (!currentPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    setLoading(true);
    reauthenticate()
      .then(() => {
        setLoading(false);
        onReauthSuccess();
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Xác thực thất bại", "Mật khẩu không đúng.");
        console.error(error);
      });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={globalStyles.container}>
        <Text style={styles.emailText}>
          Email (không thể thay đổi): {user?.email}
        </Text>

        {/* Đã xóa TextInput cho Email mới */}
        <TextInput
          style={globalStyles.input}
          placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Địa chỉ"
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={globalStyles.buttonText}>Lưu thay đổi</Text>
          )}
        </TouchableOpacity>

        {/* Re-authentication Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Yêu cầu xác thực</Text>
              <Text style={styles.modalText}>
                Để thực hiện thao tác này, vui lòng nhập lại mật khẩu hiện tại
                của bạn.
              </Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Mật khẩu hiện tại"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                style={globalStyles.button}
                onPress={handleReauthSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={globalStyles.buttonText}>Xác nhận</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={globalStyles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emailText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#7f8c8d",
    marginTop: 10,
  },
});
