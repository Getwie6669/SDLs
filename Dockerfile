FROM node:21-alpine

WORKDIR /sdl-backend-main

COPY package*.json ./

COPY . /sdl-backend-main

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]