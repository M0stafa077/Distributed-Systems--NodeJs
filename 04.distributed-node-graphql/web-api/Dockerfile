FROM node:18

WORKDIR /web-api

COPY package*.json .

RUN npm install

EXPOSE 3001

COPY . .

CMD ["npm", "run", "dev"]
