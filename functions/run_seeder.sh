if [ -z "$1" ]
  then
    echo "Which env do you want to run the seeder?"
    exit 1
fi
echo 'Running Seeder...'
NODE_ENV=$1 npx env-cmd -f ./env/.env.$1 npx sequelize-cli db:seed:all --env=$1 

