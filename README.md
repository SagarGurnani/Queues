Homework 3
=========================

### Setup

* run `npm install`.
* Install redis and run on localhost:6379
* Run `node main.js` to fire up the server instances and the proxy server

* Load balancer : 0.0.0.0:3000
* Server instance 1 : 0.0.0.0:3001
* Server instance 2 : 0.0.0.0:3002

### Additional service instance running & Demonstrate Proxy

https://github.com/SagarGurnani/Queues/blob/master/ProxyHW.gif

Proxying achieved using `http-proxy` module and the Redis `RPOPLPUSH` functionality

### Completing /set and /get

https://github.com/SagarGurnani/Queues/blob/master/ProxyHW6.gif

### Completing /recent

https://github.com/SagarGurnani/Queues/blob/master/ProxyHW7.gif

### Completing /upload and /meow

* `upload` achieved using the `LPUSH` Redis command
* `meow` achieved using the `LRANGE` and `LTRIM` Redis commands

https://github.com/SagarGurnani/Queues/blob/master/ProxyHW5.gif
