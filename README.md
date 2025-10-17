Ứng dụng React Native với Firebase

Đây là một dự án ứng dụng di động được xây dựng bằng React Native (Expo) và tích hợp các dịch vụ của Firebase, thực hiện đầy đủ các yêu cầu của bài tập.

✨ Các chức năng chính

Ứng dụng bao gồm các chức năng cốt lõi sau:

Xác thực người dùng:

Đăng ký tài khoản mới qua Email/Mật khẩu.

Đăng nhập vào tài khoản đã có.

Tự động đăng nhập lại khi mở ứng dụng.

Đăng xuất khỏi tài khoản.

Quản lý thông tin người dùng:

Hiển thị thông tin cá nhân (Email, Số điện thoại, Địa chỉ).

Cho phép người dùng cập nhật lại các thông tin cá nhân.

Bảo mật các thao tác nhạy cảm (như đổi mật khẩu) bằng việc yêu cầu xác thực lại.

Thông báo đẩy (Push Notification):

Tích hợp dịch vụ Firebase Cloud Messaging (FCM).

Lấy và hiển thị FCM Token của thiết bị.

Có khả năng nhận thông báo khi ứng dụng đang mở, đang chạy nền hoặc đã tắt.

🚀 Cài đặt và Chạy dự án

Để chạy dự án này trên máy của bạn, vui lòng thực hiện theo các bước sau:

1. Yêu cầu cần có

Node.js (phiên bản 18 trở lên).

Ứng dụng Android Studio (để sử dụng máy ảo Android) hoặc một thiết bị Android thật.

Git command line.

2. Sao chép mã nguồn

Sao chép repository này về máy của bạn bằng lệnh:

git clone [ĐƯỜNG_DẪN_REPOSITORY_GITHUB_CỦA_BẠN]
cd MyFirebaseApp


3. Cấu hình Firebase

Đây là bước quan trọng nhất. Ứng dụng sẽ không thể hoạt động nếu không có các tệp cấu hình này.

Tạo dự án Firebase: Truy cập Firebase Console và tạo một dự án mới.

Tạo ứng dụng Android:

Trong dự án, thêm một ứng dụng Android với package name là com.username.myfirebaseapp.

Tải về tệp google-services.json và đặt nó vào thư mục gốc của dự án (MyFirebaseApp/).

Tạo ứng dụng Web:

Cũng trong dự án đó, thêm một ứng dụng Web.

Firebase sẽ cung cấp cho bạn một đoạn mã chứa đối tượng firebaseConfig. Hãy sao chép các giá trị trong đó.

Mở tệp firebaseConfig.js trong dự án và dán các giá trị tương ứng vào.

Bật Authentication:

Vào mục Authentication -> Sign-in method.

Chọn Email/Password và bật nó lên.

4. Cài đặt Dependencies

Mở terminal tại thư mục gốc của dự án và chạy lệnh sau để cài đặt tất cả các thư viện cần thiết:

npm install


5. Chạy ứng dụng

Sau khi cài đặt xong, hãy chạy lệnh sau để build và cài đặt ứng dụng lên máy ảo hoặc thiết bị Android của bạn:

npx expo run:android


Quá trình này có thể mất vài phút ở lần chạy đầu tiên. Sau khi hoàn tất, ứng dụng sẽ tự động mở. Từ những lần sau, bạn chỉ cần chạy npx expo start --dev-client và mở ứng dụng đã được cài đặt.

🛠️ Kiểm tra chức năng

1. Xác thực & Quản lý người dùng

Đăng ký: Mở ứng dụng và chọn "Đăng ký". Nhập email và mật khẩu hợp lệ.

Đăng nhập: Sau khi đăng ký, bạn sẽ tự động được chuyển đến màn hình thông tin. Hãy thử "Đăng xuất", sau đó đăng nhập lại với tài khoản vừa tạo.

Cập nhật thông tin: Tại màn hình thông tin, nhấn "Chỉnh sửa". Thử thay đổi số điện thoại, địa chỉ, mật khẩu và nhấn "Lưu thay đổi".

2. Kiểm tra Push Notification (FCM)

Lấy FCM Token:

Đăng nhập vào ứng dụng.

Tại màn hình "Thông tin người dùng", sao chép chuỗi ký tự dài ở mục FCM Token.

Gửi thông báo từ Firebase:

Truy cập vào dự án của bạn trên Firebase Console.

Tìm đến mục Cloud Messaging (thường nằm trong nhóm Build hoặc có thể truy cập qua đường dẫn trực tiếp).

Nhấn "Create campaign" -> "Notifications".

Điền Notification title (Tiêu đề) và Notification text (Nội dung).

Nhấn vào nút "Send test message" ở khung bên phải.

Dán FCM Token bạn vừa sao chép vào ô và nhấn "Test".

Xác nhận: Bạn sẽ nhận được thông báo trên thiết bị của mình, chứng tỏ chức năng đã hoạt động thành công.
