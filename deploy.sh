#!/bin/bash

npm run build
tar cf /tmp/asx-deploy.tar.gz dist/ index.html 
scp /tmp/asx-deploy.tar.gz 54.252.99.72:/tmp/
ssh 54.252.99.72 tar xf /tmp/asx-deploy.tar.gz -C /opt/www/asx/web-client
