cd ../

IMAGE_NAME="backend-core-api"
REPO_NAME="878672029675.dkr.ecr.ap-south-1.amazonaws.com"
TAG="v4"

echo $IMAGE_NAME
echo $REPO_NAME
echo $TAG

docker build -t $REPO_NAME/$IMAGE_NAME:$TAG -t $REPO_NAME/$IMAGE_NAME:latest --build-arg NODE_ENV=$NODE_ENV --platform=linux/amd64 .
docker push $REPO_NAME/$IMAGE_NAME --all-tags
