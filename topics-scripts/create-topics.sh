if [ -z "$1" ]
  then
    echo "Which env do you create topics?"
    exit 1
fi
# cd afto_api
echo 'Running create topics...'
NODE_ENV=$1 node ./create-topics.js
