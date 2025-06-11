FROM nginx:alpine

EXPOSE 80

COPY apps/accounts-site/nginx.conf /etc/nginx/nginx.conf

COPY dist/apps/accounts-site /app


CMD ["nginx"]