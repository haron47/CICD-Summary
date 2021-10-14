docker pull [Your Docker Image]
docker run --env-file /home/ec2-user/.env --publish [Local Port Number]:[Docker Port Number] -it --detach --name [Your new Docker Container Name]  [Your Docker Image] /bin/bash
