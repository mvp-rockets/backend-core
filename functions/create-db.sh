set -x

if [ -z "$1" ]
  then
    echo "Which env do you want to restore for?"
    exit 1
fi
echo 'Creating db...'
NODE_ENV=$1 npx env-cmd -f ./env/.env.$1 npx sequelize-cli db:create --env=$1 
