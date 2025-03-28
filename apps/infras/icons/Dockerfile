FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY apps/infras/icons/nginx.conf /etc/nginx/nginx.conf
COPY apps/infras/icons/src /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
