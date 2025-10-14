# Pawfect Care

Structure-only scaffold. Content will be in English; explanatory notes in Vietnamese.
- Start page: `src/index.html`
- Pages inside `src/pages/`
- Assets inside `src/assets/`

Note: Hiện tại chỉ là cấu trúc, chưa có nội dung/logic bên trong. Sau khi nhận Figma, ta sẽ triển khai UI/UX theo thiết kế.
Cấu trúc mới

- assets/css/base.css : reset, tokens, container, button dùng chung.
- assets/css/header.css : style cho header cố định (không đổi khi chuyển page).
- assets/css/home.css : style riêng cho Home.
- assets/css/login.css : giữ nguyên cho Login/Signup (đã có sẵn).
- assets/js/utils.js : helper DOM + validator + localStorage dùng chung.
- assets/js/home.js : logic nhẹ cho Home (đánh dấu nav active).
- assets/js/auth.js : tách logic đăng nhập/đăng ký từ file JS cũ.# 251EIE503002_WebDevelopment_Group1
