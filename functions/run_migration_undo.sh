if [ -z "$1" ]
  then
    echo "Which env do you want to run the migration?"
    exit 1
fi
echo 'Running Migration...'
NODE_ENV=$1 npx env-cmd -f ./env/.env.$1 npx sequelize-cli db:migrate:undo --env=$1