# dzen-post-comments
SPA: Comments 

### Using techologies: 
* Turbo monorepo with
    * Nest.js
    * React.js
* WebSocket
* JWT Authentication
* MongoDB
* Amazon SQS, Lambda (for saving posts in DB)
* GraphQL

### How to start project without Docker
1. `npm install` from root directory
2. `npm run dev` from root directory

### How to start Docker
1. docker build .
2. docker run -i -p 5173:5173 -p 3000:3000  image_name 