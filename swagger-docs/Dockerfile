FROM nginx:alpine

COPY openapi.yaml /usr/share/nginx/html/openapi.yaml
COPY index.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
