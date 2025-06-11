FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY apps/res-service/nginx.conf /etc/nginx/nginx.conf
COPY apps/res-service/src /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
