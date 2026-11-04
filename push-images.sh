#!/bin/sh
set -eu
cd "$(dirname "$0")"

service="${1:-}"
version="${2:-}"

if [ "$service" != api ] && [ "$service" != web ]; then
  echo "用法: bash push-images.sh api|web 版本号"
  exit 1
fi
if [ -z "$version" ]; then
  echo "用法: bash push-images.sh api|web 版本号"
  exit 1
fi

export IMAGE_TAG="${version#v}"
user="${DOCKERHUB_USER:-fantesty}"
if [ "$service" = api ]; then
  name=personal-kb-api
else
  name=personal-kb-web
fi

echo "推送 docker.io/${user}/${name}:${IMAGE_TAG}"
docker compose -f docker-compose.prod.yml build "$service"
docker compose -f docker-compose.prod.yml push "$service"
