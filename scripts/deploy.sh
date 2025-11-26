BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Deploying with branch: $BRANCH"

cd app/soundcloud-nextjs-spring-mongodb-restful/
git fetch -a
git checkout $BRANCH
git pull

docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml pull backend-soundcloud
docker compose -f docker-compose.yml pull frontend-soundcloud
docker compose -f docker-compose.yml up -d
docker system prune -af