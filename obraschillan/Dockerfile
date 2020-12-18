FROM node:latest as node
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build -- --prod

FROM nginx:alpine
COPY --from=node /app/dist/obraschillan /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf