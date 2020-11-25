FROM node:12.16.1-alpine
USER root
# Create app directory
WORKDIR /usr/src/app
RUN apk --update add \
  unzip \
  git \
  curl 

# Bundle app source
COPY ./lib ./lib
COPY index.js index.js
COPY ./data ./data
COPY ./public ./public
COPY package*.json ./
RUN npm install
CMD [ "node","index"]