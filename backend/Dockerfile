FROM node:18.14.1

EXPOSE 8080

WORKDIR /backend

COPY package*.json ./

RUN npm i

COPY src src

CMD npm run start