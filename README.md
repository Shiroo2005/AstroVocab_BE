# 📘 Node.js Backend Project with TypeORM

Dự án Node.js sử dụng Express, TypeORM, JWT Authentication.

---

## 🛠️ Yêu cầu

- Node.js >= 16.x
- Mysql
- npm

---

## ⚙️ Cấu hình môi trường

Tạo file `.env` ở cùng cấp với thư mục `src`, và điền các biến môi trường như sau:

```env
NODE_ENV= #production | development


# Database
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
DB_HOST=

PORT=

#URL
HOST_URL=
FE_URL=

#JWT
JWT_SECRET_KEY=
ACCESS_TOKEN_EXPIRE_TIME= #1d
REFRESH_TOKEN_EXPIRE_TIME= #7d
VERIFICATION_EMAIL_EXPIRE_TIME= #15p

#EMAIL
RESEND_API_KEY=
FROM_EMAIL=
```
