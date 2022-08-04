- [1. Introduction](#1-introduction)
- [2. Pre-requirement](#2-pre-requirement)
- [3. Running the project](#3-running-the-project)
- [4. Connect to container](#4-connect-to-container)
- [4. Db operations](#4-db-operations)
- [5. Cron](#5-cron)
    - [cron](#cron)
    - [cronitor](#cronitor)
- [6. Cors](#6-cors)
- [7. Authors/maintainer/contributor](#7-authorsmaintainercontributor)

## 1. Introduction

It's backend project build on nodejs. which can be used as a reference/based for new/existing project.

## 2. Pre-requirement

- Ubuntu 20.04.4 LTS
- docker(19.xx)
- docker-compose(1.28.xx)
  
## 3. Running the project
  
   ```
   docker-compose up
   
   ```

## 4. Connect to container

   ```
   ./connect.sh 
   ```

## 4. Db operations

```
Commands:
  npm run db:create  --env=env                         Create database specified by configuration
  npm run db:migrate --env=env                         Run pending migrations
  npm run db:migrate:undo --env=env                    Reverts a migration
  npm run db:drop --env=env                            Drop database specified by configuration(make sure all connections are closed)

```

## 5. Cron

For cron related works, Project use cron package for running your code and cronitor package to monitoring your cron.

#### cron

cron installation `npm i cron`

How to use : <https://www.npmjs.com/package/cron>

#### cronitor

Pre-requirement: Create account in cronitor portal (<https://cronitor.io/>)

cronitor installation `npm i cronitor`

How to use <https://github.com/cronitorio/cronitor-js>

## 6. Cors

cors installation `npm i cors`

How to use : <https://www.npmjs.com/package/cors>

## 7. Authors/maintainer/contributor

- Yashjeet Luthra (yash@napses.com)
- Hitesh Bhati (hitesh.bhati@napses.com)
