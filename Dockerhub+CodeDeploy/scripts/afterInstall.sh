docker pull [Your Docker Image]
docker run --env-file /home/ubuntu/.env --publish [Local Port Number]:[Docker Port Number] -it --detach --name woomin-facebook-codedeploy [Your Docker Image] /bin/bash
