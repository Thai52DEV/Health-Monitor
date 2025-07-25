# Dùng image mới và ổn định hơn
FROM node:18-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package vào container
COPY package*.json ./

# Cài đặt thư viện Node.js
RUN npm install

# Copy toàn bộ source code Backend vào container
COPY . .

# Expose port ứng dụng (chỉnh đúng nếu bạn dùng port khác)
EXPOSE 5000

# Chạy ứng dụng ở chế độ dev (nếu dùng nodemon)
CMD ["npm", "run", "dev"]
