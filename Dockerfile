FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env /app/.env
COPY . .

RUN npm run build

EXPOSE 3000 5173 80 443 

CMD ["npm", "run", "start"]