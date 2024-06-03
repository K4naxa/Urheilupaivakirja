FROM node:20

WORKDIR /mydir  
COPY frontend front
RUN cd front && npm install --silent && npm run build --silent && cd ..
RUN cp -r front/dist build && rm -r front
COPY backend .
COPY database/migrations migrations
COPY knexfile_env.js knexfile.js
RUN npm install
CMD npx knex migrate:latest && node ./bin/www