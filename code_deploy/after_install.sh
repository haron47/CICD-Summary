#!/bin/bash

cd /home/ec2-user/app

sudo rm -rf node_modules
yarn cache clean
sudo yarn