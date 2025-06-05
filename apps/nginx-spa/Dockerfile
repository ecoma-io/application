FROM nginx:stable-alpine

RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf

COPY apps/nginx-spa/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx"]