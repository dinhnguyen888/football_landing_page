# Sử dụng Nginx bản nhẹ nhất làm nền
FROM nginx:alpine

# Copy code đã build vào đúng thư mục mặc định của Nginx
COPY build/ /usr/share/nginx/html

# Mở cổng 80 để truy cập web
EXPOSE 80

# Lệnh khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
