FROM node:22

WORKDIR /app

RUN npm install -g npm@10

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
