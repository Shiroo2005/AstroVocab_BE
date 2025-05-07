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
NODE_ENV=development

# Database
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
DB_HOST=

PORT=8081

#URL
HOST_URL=
FE_URL=
REDIS_URL=

#JWT
JWT_SECRET_KEY=
ACCESS_TOKEN_EXPIRE_TIME=60480000 #1d
REFRESH_TOKEN_EXPIRE_TIME=60480000 #7d
VERIFICATION_EMAIL_EXPIRE_TIME=900000 #15p 

#OAuth

#GOOGLE
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

#EMAIL
RESEND_API_KEY=
FROM_EMAIL=

```
