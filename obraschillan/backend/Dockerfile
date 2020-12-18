FROM node:carbon-alpine
COPY package*.json /src/
WORKDIR ./src
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
COPY . .
EXPOSE 3000
CMD node src/app.js
