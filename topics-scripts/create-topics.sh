if [ -z "$1" ]
  then
    echo "Which env do you create topics?"
    exit 1
fi

echo 'Running create topics...'
export $(grep GOOGLE_APPLICATION_CREDENTIALS "../env/.env.$1")
export GOOGLE_APPLICATION_CREDENTIALS="../$GOOGLE_APPLICATION_CREDENTIALS"
NODE_ENV=$1 node ./create-topics.js
