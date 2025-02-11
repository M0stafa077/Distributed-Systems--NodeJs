FROM node:18-alpine

WORKDIR /recipe-api

COPY package*.json .

RUN npm install -g typescript
RUN npm install

EXPOSE 5000

COPY . .

CMD ["npm", "start"]
