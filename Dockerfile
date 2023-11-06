FROM node:lts

WORKDIR /app

COPY . .
COPY .env /app/.env

RUN npm install
RUN npm run build

EXPOSE 3000 80 443

CMD ["npm", "run", "start"]