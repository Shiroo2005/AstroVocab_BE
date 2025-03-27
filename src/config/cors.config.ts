import cors from 'cors'
export const corsConfig = cors({
  origin: process.env.HOST_FE || 'http://localhost:3000',
  credentials: true, // Nếu có dùng cookies hoặc session
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // các phương thức HTTP cho phép
  allowedHeaders: ['Content-Type', 'Authorization'] // các headers cho phép
})
