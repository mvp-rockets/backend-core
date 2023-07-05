# Define variables
IMAGE_NAME="backend-core-api"
REPO_NAME="878672029675.dkr.ecr.ap-south-1.amazonaws.com"


# Push the Docker image to the repository
docker push $REPO_NAME/$IMAGE_NAME:$TAG