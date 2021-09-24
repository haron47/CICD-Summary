
#!/bin/bash

# delete all servers and start the server as a daemon
pm2 delete all

cd /home/ec2-user/app
pm2 start --name server npm -- run start