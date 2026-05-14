FROM node:18-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY gateway/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-frontend /app/dist /usr/share/nginx/html
EXPOSE 80