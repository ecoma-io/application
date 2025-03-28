FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY apps/icons/nginx.conf /etc/nginx/nginx.conf
COPY apps/icons/src /usr/share/nginx/html

# Mở port 80
EXPOSE 80

# Khởi động nginx
CMD ["nginx", "-g", "daemon off;"]
