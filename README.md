## About The Project
---------------------
### Introduction 
 It is a sample project for nodejs. which can be used as a based for new project
### Requirements 
1. OS: Ubuntu 20.04.4 LTS
2. NVM: v0.38.0
3. NPM: v8.13.2
4. Nodejs: v16.15.1
5. docker and docker-compose latest
### Installation

#### steps to start api
1. After cloning update name, description and version with your project details in package.json
2. .env.dev and .env.test should be updated with your configuration.
3. from the root directory execute ./start_api.sh dev

#### db commands.
1. Create database for dev & test environment: open cmd prompt go inside the functions and run ./create-db.sh :env \n
   example:  ./create-db.sh dev

###### Maintainers : yash@napses.com