
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install bcrypt
COPY . .

EXPOSE 3000

CMD [ "node", "dist/main.js" ]

