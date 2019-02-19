FROM node:11.9

COPY * /usr/src/app/
WORKDIR /usr/src/app/
RUN npm install

RUN npm test
