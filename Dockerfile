FROM node:lts

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5173 3000

CMD ["npm", "run", "dev"]