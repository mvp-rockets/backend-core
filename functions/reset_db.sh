set -e

if [ -z "$1" ]
  then
    echo "Which env do you want to run the seeder?"
    exit 1
fi
echo 'deleting db....'
NODE_ENV=$1 npx env-cmd -f ./env/.env.$1 npx sequelize-cli db:drop --env=$1

echo 'Creating DB....'
NODE_ENV=$1 npx env-cmd -f ./env/.env.$1 npx sequelize-cli db:create --env=$1

echo 'Run migration'
NODE_ENV=$1 npx env-cmd -f ./env/.env.$1 npx sequelize-cli db:migrate --env=$1

echo 'Running Seeder...'
NODE_ENV=$1 npx env-cmd -f ./env/.env.$1 npx sequelize-cli db:seed:all --env=$1