FROM node:18-alpine

WORKDIR /web-api

COPY package*.json .

RUN npm install -g typescript
RUN npm install

EXPOSE 3001

COPY . .

CMD ["npm", "start"]
