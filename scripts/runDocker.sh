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