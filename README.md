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
# Database
DB_NAME=your_db_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_PORT=3306
DB_HOST=localhost

# URL Server
HOST_URL=http://localhost:8081

# JWT
JWT_SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_TIME=1d
REFRESH_TOKEN_EXPIRE_TIME=2d
