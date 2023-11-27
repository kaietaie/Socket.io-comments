# dzen-post-comments
SPA: Comments 

### Using techologies: 
* Turbo monorepo with
    * Nest.js
    * React.js
* WebSocket (for fetching and sending comments)
* JWT Authentication
* MongoDB
* Amazon SQS, Lambda (for saving posts in MongoDB), S3 for files
* GraphQL
* Caching (user info)
* File saving (txt and images[jpg, png, gif] )



### How to start project without Docker
1. `npm install` from root directory
2. `npm run dev` from root directory   

    Also you can build project with `npm run build` and run it with `npm run start`. 
    After this open in browser [localhost:3000](http://localhost:3000).

### How to start Docker
1. `docker build .` or `docker pull kaietaie/spa-comments`
2. docker run -p 3000:3000 -p 80:80 -p 443:443 image_name 

