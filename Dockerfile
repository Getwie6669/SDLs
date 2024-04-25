FROM node:20.7.0

WORKDIR /sdl-backend-main

COPY package*.json ./

COPY . /sdl-backend-main

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]