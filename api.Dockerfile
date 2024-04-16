FROM node:20.12.2
ARG NODE_ENV
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./
# COPY ./.sequelizerc ./

# RUN npm i -g sequelize-cli@6.2.0
RUN npm i
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./ .

EXPOSE 3000

# CMD [ "/bin/bash", "-c", "npm run build:env && npm run db:migrate --env=$NODE_ENV && npm run db:seed:all --env=$NODE_ENV && node index.js" ]
CMD [ "/bin/bash", "-c", "node index.js" ]
