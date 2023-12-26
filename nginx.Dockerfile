FROM nginx:alpine

WORKDIR /app

COPY ./nginx.conf .

COPY ./nginx.conf /etc/nginx/nginx.conf