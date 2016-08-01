#!/bin/bash

# Update API codebase
ssh -i ~/.ssh/private-projects.pem ubuntu@asx.purinda.com git --git-dir=/var/www/asx/asx-platform-api/.git --work-tree=/var/www/asx/asx-platform-api/ pull origin master

npm run build
tar cf /tmp/asx-deploy.tar.gz dist/ index.html 
scp -i ~/.ssh/private-projects.pem /tmp/asx-deploy.tar.gz ubuntu@asx-api.purinda.com:/tmp/
ssh -i ~/.ssh/private-projects.pem ubuntu@asx-api.purinda.com tar xf /tmp/asx-deploy.tar.gz -C /var/www/asx/web-client/
