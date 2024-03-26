FROM node:16-alpine

WORKDIR /sdl-backend

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]