# NestJS

## 🚀NestJS 설치 및 실행

```
npm i
npm run start
```

## 🏚CI / CD 아키텍쳐
![image](https://user-images.githubusercontent.com/66551410/135451992-e6d06f81-6a88-4e36-b76b-2df2449a3f95.png)

## 📃설명

### appspec.yml  
- CodeDeploy Agent 가 수행할 작업과 환경을 설정하는 파일
- source 는 CodeBuild 로 부터 전달받은 artifacts 의 파일 시스템 중 가져오고자 하는 파일
- destination 은 배포하고자 하는 호스트(EC2) 의 파일 시스템에서 source 로부터 가져온 artifacts 가 위치할 디렉터리
```
version: 0.0
os: linux
files:
  - source: /
    destination: /home/ec2-user/app
hooks:
  AfterInstall:
    - location: scripts/pullDocker.sh
      timeout: 300
      runas: ec2-user
  ApplicationStart:
    - location: scripts/runDocker.sh
      timeout: 300
      runas: ec2-user
  ApplicationStop:
    - location: scripts/stopDocker.sh
      timeout: 60
      runas: ec2-user
```

### buildspec.dev.yml 
- CodeBuild 가 소스코드를 빌드할 때 수행할 작업과 환경을 설정하는 파일
- phases 는 CodeBuild 에서 작업 단계를 나타내는 특수한 단계
- artifacts 는 CodeBuild 가 작업을 마친 뒤 CodeDeploy 에게 전달할 파일들을 명시하는 부분으로, 여기서는 appspec.yml 과 docker 커맨드가 포함된 scripts/* , 그리고 docker-compose.dev.yml 파일을 전달
```
version: 0.1
phases:
  pre_build:
    commands:
      - 'echo Logging in to Docker Hub...'
      - 'docker login --username="<DOCKERHUB_USERNAME>" --password="<DOCKERHUB_PASSWORD>"'
  build:
    commands:
      - 'echo Build started on `date`'
      - 'echo Building the Docker image...'
      - 'docker-compose -f docker-compose.yml build'
  post_build:
    commands:
      - 'echo Build completed on `date`'
      - 'echo Pushing the Docker image...'
      - 'docker-compose -f docker-compose.yml push'

artifacts:
  files:
    - 'appspec.yml'
    - 'scripts/*'
    - 'docker-compose.yml'
    - 'Dockerfile'
    - 'dist/*'
    - 'node_modules/*'
    - 'package.json'
    - 'package-lock.json'
    - 'buildspec.dev.yml'
    - 'nest-cli.json'
    - 'tsconfig.build.json'
    - 'tsconfig.json'
    - 'src/*'
```

### Dockerfile
- builder :소스코드를 복사해서 빌드를 진행
- runtime : 빌드된 파일과 노드 모듈만을 가져온 뒤 커맨드를 실행
```
FROM node:14.16.0-alpine3.11 as builder
WORKDIR /app

COPY package*.json ./
COPY ./tsconfig.json ./

RUN npm install

COPY . .
## compile typescript
RUN npm run build
## remove packages of devDependencies
# RUN npm prune --production
# ===================================================
FROM node:14.16.0-alpine3.11 as runtime
WORKDIR /app

# ENV NODE_ENV="development"
# ENV DOCKER_ENV="development"
# ENV PORT=5000
## Copy the necessary files form builder
COPY --from=builder "/app/dist/" "/app/dist/"
COPY --from=builder "/app/node_modules/" "/app/node_modules/"
COPY --from=builder "/app/package.json" "/app/package.json"

EXPOSE 3000
CMD ["npm", "run", "start"]
```

### docker-compose.yml
```
version: '3'
services:
  app:
    restart: always
    image: <DOCKERHUB_IMAGES>
    build:
      dockerfile: Dockerfile
      context: .
    container_name: 'app'
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - '3000:3000'

volumes:
  node_modules:
```

### stopDocker.sh
- 모든 컨테이너를 stop 시키는 명령
```
docker stop $(docker ps -a -q)
```

### runDocker.sh
- CodeDeploy 가 EC2 상에서 가져온 이미지를 컨테이너로 띄우는 쉘 스크립트
```
if [ "$DEPLOYMENT_GROUP_NAME" == "dev" ]
then
  pwd
  # Remove any anonymous volumes attached to containers
  docker-compose -f /home/ec2-user/app/docker-compose.yml rm -v 
  # build images and run containers
  docker-compose -f /home/ec2-user/app/docker-compose.yml up --detach --renew-anon-volumes
elif [ "$DEPLOYMENT_GROUP_NAME" == "stage" ]
then
  # Remove any anonymous volumes attached to containers
  docker-compose -f /deploy/docker-compose.stage.yml rm -v 
  # build images and run containers
  docker-compose -f /deploy/docker-compose.stage.yml up --detach --renew-anon-volumes
elif [ "$DEPLOYMENT_GROUP_NAME" == "production" ]
then
  # Remove any anonymous volumes attached to containers
  docker-compose -f /deploy/docker-compose.yml rm -v 
  # build images and run containers
  docker-compose -f /deploy/docker-compose.yml up --detach --renew-anon-volumes
fi
```

### pullDocker.sh
- CodeDeploy 가 EC2 상에서 실행할 쉘 스크립트
```
# docker login
docker login -u ssunnu -p testtesttest

# pull docker image
if [ "$DEPLOYMENT_GROUP_NAME" == "dev" ]
then
  pwd
  docker-compose -f /home/ec2-user/app/docker-compose.yml pull
elif [ "$DEPLOYMENT_GROUP_NAME" == "stage" ]
then
  docker-compose -f /deploy/docker-compose.stage.yml pull
elif [ "$DEPLOYMENT_GROUP_NAME" == "production" ]
then
  docker-compose -f /deploy/docker-compose.yml pull
fi
```
