# koa

* use index.test.js for unit tests.
* use index.spec.js for integration tests. 


You need 3 instances of redis


`docker run --name redis-cache -d redis redis-server --port 6379`

`docker run --name redis-queue -d redis redis-server --port 6380`

`docker run --name redis-limiter -d redis redis-server --port 6381`


to debug redis run 

`docker run -it --link redis-cache:redis --rm redis redis-cli -h redis -p 6379`



Run mongodb


`docker run --name mongodb -p 27018:27017 -d mongo`

connect on port 27018



