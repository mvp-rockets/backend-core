RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]
  then
    echo "No argument supplied"
  else
    if [ "$(node -v)" != "$(cat .nvmrc)" ];
      then
        echo "${RED}Node version is incorrect. Please use $(cat .nvmrc). You can install nvm and run 'nvm use'."
        exit 1
    fi
    cd functions
    docker-compose up -d &&
    npm install &&
    NODE_ENV=$1 npm run  $1Server
fi

