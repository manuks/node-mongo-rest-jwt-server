git clone git@github.com:manuks/node-mongo-rest-jwt-server.git yourprojectname

cd yourprojectname
npm install

setup your resources in the environment variable. See example below

export REST_RESOURCES=channels,channel-programs

add a secret key in the environment variable.

export JWT_SECRET=thisIsMySecret

node app.js

Now you have a ready to use Stateless rest api with jwt authentication.

Create your first user using the api.

curl -F "email=test@emial.com" -F "pwd=testpwd" -F "secret=put_your_secret_in_env_variable" http://127.0.0.1:5000/v1/users

to get authorization token

curl -F "email=test@emial.com" -F "pwd=testpwd" http://127.0.0.1:5000/v1/authenticate


use the token in header to access apis

To insert a channel in channels resource 

curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAZW1pYWwuY29tIiwiaWF0IjoxNDEyNDIyNTQ5LCJwb3N0ZWRPbiI6IjIwMTQtMTAtMDRUMTE6MzQ6NDAuMjg2WiIsIl9pZCI6IjU0MmZkYjUwNzQ3MTYwYjQ1ZmFjOWEzMyJ9.HV0vHjNSuMD1fhe5y6_xbtf0f2JXNAb64ksU1FHHseA" -F "name=NGC" http://127.0.0.1:5000/v1/channels

To list all channel resources

curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAZW1pYWwuY29tIiwiaWF0IjoxNDEyNDIyNTQ5LCJwb3N0ZWRPbiI6IjIwMTQtMTAtMDRUMTE6MzQ6NDAuMjg2WiIsIl9pZCI6IjU0MmZkYjUwNzQ3MTYwYjQ1ZmFjOWEzMyJ9.HV0vHjNSuMD1fhe5y6_xbtf0f2JXNAb64ksU1FHHseA" http://127.0.0.1:5000/v1/channels