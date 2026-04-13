#!/bin/bash

# CONFIG
IMAGE_NAME="staging-avirtrekkers"
CONTAINER_NAME="staging-avirtrekkers-container"
PORT=4001         # Changed port to 4001
ENV_FILE=".env"
BRANCH="staging"

echo "🚀 Starting Staging Deployment Process......."

cd /opt/app/preprod/avir/avirtrekkersBackend || { echo "❌ Cannot cd to project folder"; exit 1; }

# Step 1: Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo "⚠ Not on branch '$BRANCH'. Switching...."
    git checkout $BRANCH || { echo "❌ Cannot switch to branch $BRANCH"; exit 1; }
fi

# Step 2: Pull latest code
echo "📥 Pulling latest code from branch '$BRANCH'..."
git fetch origin $BRANCH
LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse origin/$BRANCH)

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
    echo "ℹ No new changes to deploy, but proceeding to restart/rebuild as requested."
else
    git reset --hard origin/$BRANCH || { echo "❌ Git reset failed"; exit 1; }
    echo "✅ Latest code pulled."
fi

# Step 3: Stop old container
echo "🛑 Stopping and removing old container..."
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
    docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME
    echo "✅ Old container removed."
else
    echo "⚠ No existing container found."
fi

# Step 4: Build Docker image
echo "🐳 Building Docker image: $IMAGE_NAME ..."
docker build -t $IMAGE_NAME . || { echo "❌ Docker build failed."; exit 1; }

# Step 5: Run new container
echo "📦 Running container: $CONTAINER_NAME ..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:$PORT \
  --env-file $ENV_FILE \
  -e TZ=Asia/Kolkata \
  $IMAGE_NAME || { echo "❌ Docker run failed."; exit 1; }

# Step 6: Show logs
echo "⏳ Waiting for container to initialize..."
sleep 5
echo "📄 Showing container logs..."
docker logs $CONTAINER_NAME
