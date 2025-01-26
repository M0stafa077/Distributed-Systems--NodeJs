FROM node:18

WORKDIR /recipe-api

COPY package*.json .

RUN npm install

EXPOSE 5000

COPY . .

CMD ["npm", "run", "dev"]
