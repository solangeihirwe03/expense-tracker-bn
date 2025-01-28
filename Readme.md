


Guide line on setting up dockerfile and docker-compose yml 
---------
While setting up docker to use mysql database  and ExpressJs apis I've done the following
1. Setting up dockerfile for whole project
2. Setting up docker compose to run `mysql` and `NodeJs` services along with `sequelizeORM`

*let's start by preparing project dockerfile*
in project root directory create `Dockerfile` then insert the following contents
I have added comment on every line to make them be meaningful to you.

```
FROM node:18-alpine # Use nodeJS image from dockerhub

WORKDIR /app # Working directory
COPY package*.json ./  # Copy package.json from local working directory to docker image  
RUN npm install --only=development  # install dependencies and devDependencies as well
COPY . . # Copy all the files from currently working directory to docker /app directory
EXPOSE 3000 # Export port 3000 to be consume in your browser outside of docker image
CMD ["npm" , "start"] # since you've prepared everything then start the application

```
## Docker composer file
This file you use to set up many multi container in single configuration file
In root directory create file called `docker-compose.yml`
## Docker-file service along with explanation of what everyline does 
```
services: 
  app:
    build:
      context: .  # dot (.) means current working direcor
      dockerfile: Dockerfile #previously dockerfile we created
    ports:
      - "3000:3000" # our application is going be to accessed on port 3000 in browser / outside of docker image
    environment:    # below are environment and their value that I have in my .env file on my local repository
      - DB_HOST=127.0.0.1
      - DB_PORT=3306
      - DB_USER=root
      - DB_NAME=expenseTracker
      - DB_PASSWORD=password
      - DB_DIALECT=mysql  # this value can also be sqlite, mongodb, postgress
    depends_on:    # this I put other services which has to be ready before this one, now we need Data base service to be ready before accessing our nodejs api
      - db
    volumes: # Named volumes and paths on the host mapped to paths in the container
     - .:/app
     - /app/node_modules
     
```

## Full clean docker-compose yml file
```
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=127.0.0.1
      - DB_PORT=3306
      - DB_USER=root
      - DB_NAME=expenseTracker
      - DB_PASSWORD=password
      - DB_DIALECT=mysql
    depends_on:
      - db
    volumes:
     - .:/app
     - /app/node_modules

  db:
    image: mysql:latest
    container_name: mysql_db
    restart: always
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: expenseTracker
    volumes:
      - expense-tracker_db_data:/var/lib/mysql

volumes:
  expense-tracker_db_data:
  ``` 
Since we have our dockerfile ready and docker compose now we need to let our ` src/database/config/config.js ` to use database called we named `db` in our `docker composer file`
```
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: "db" || process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
  }
}
```

Additionally you might need to execute script using docker by these command in terminal 
docker run app NPM_SCRIPT_YOU_WANT_TO_EXECUTE` ex: docker-compose run app npm migrate

## Other important commands
``` docker-compose run app npx sequelize-cli migration:generate --name create-example-table ```
this command creates migration directory
- open -a docker # to start docker desktop application
- docker-compose build # building an image
- docker-compose stop  # stopping running container
- docker-compose start # start running container
- docker-compose ps # viewing running containers
- docker-compose run app npm run  sequelize:init to create migration 
- docker-compose run app npm run migrate  # running migration
-  docker exec -it mysql_db mysql -u root -p  #mysql_db  is the same image name written in docker compose 
Advisably I would recommend to run your migrations locally in order to execute few commands with docker
