import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";

// Import styles
import { globalStyles } from "../styles/globalStyles";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    // Lấy FCM token
    messaging()
      .getToken()
      .then((token) => {
        console.log("FCM Token:", token);
        setFcmToken(token);
      });

    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
      const subscriber = firestore()
        .collection("users")
        .doc(currentUser.uid)
        .onSnapshot(
          (documentSnapshot) => {
            if (documentSnapshot.exists) {
              setUserInfo(documentSnapshot.data());
            }
            setLoading(false);
          },
          (error) => {
            console.error(error);
            setLoading(false);
          }
        );

      // Hủy lắng nghe khi component unmount
      return () => subscriber();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Thông tin người dùng</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.info}>{userInfo?.phone || "Chưa cập nhật"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.info}>
            {userInfo?.address || "Chưa cập nhật"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={globalStyles.buttonText}>Chỉnh sửa thông tin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[globalStyles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={globalStyles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>

      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>
          FCM Token (để test push notification):
        </Text>
        <Text selectable={true} style={styles.tokenText}>
          {fcmToken}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  info: {
    fontSize: 16,
    color: "#333",
    maxWidth: "70%",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    marginTop: 10,
  },
  tokenContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  tokenLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  tokenText: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },
});
