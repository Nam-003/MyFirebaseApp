import React, { useEffect } from "react";
import { Platform, Alert } from "react-native";

// Firebase imports
import messaging from "@react-native-firebase/messaging";

// App Navigator
import AppNavigator from "./src/navigation/AppNavigator";

// Cấu hình lắng nghe tin nhắn push notification
// Chạy ở cấp độ cao nhất của ứng dụng
async function setupCloudMessaging() {
  // Yêu cầu quyền trên iOS
  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  }

  // Lắng nghe tin nhắn khi ứng dụng đang mở (foreground)
  messaging().onMessage(async (remoteMessage) => {
    Alert.alert(
      remoteMessage.notification.title,
      remoteMessage.notification.body
    );
  });

  // Xử lý tin nhắn khi ứng dụng được mở từ trạng thái background/quit
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
  });

  // Kiểm tra xem ứng dụng có được mở từ một thông báo đã tắt không
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
      }
    });

  // Lắng nghe tin nhắn ở background (headless task)
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });
}

export default function App() {
  useEffect(() => {
    setupCloudMessaging();
  }, []);

  return <AppNavigator />;
}
