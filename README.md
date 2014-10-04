git clone git@github.com:manuks/node-mongo-rest-jwt-server.git yourprojectname

cd yourprojectname
npm install

#setup your resources in the environment variable. See example below
export REST_RESOURCES=channels,channel-programs

node app.js

