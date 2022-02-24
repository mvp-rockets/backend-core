if [ -z "$1" ]
  then
    echo "No argument supplied"
  else
    cd functions
    docker-compose up -d &&
    npm install &&
    NODE_ENV=$1 npm run  devServer
fi

