FROM node:lts

WORKDIR /app

COPY . .
COPY .env /app/.env

RUN npm install

EXPOSE 3000 5173 80 443 

CMD ["npm", "run", "dev"]