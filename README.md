# socket.io-redis-sentinel-sample

This is simple node.js application with [Express.js 4.x](https://github.com/visionmedia/express), [Socket.IO 1.x](https://github.com/automattic/socket.io),  [socket.io-redis](https://github.com/Automattic/socket.io-redis) and [redis-sentinel](https://github.com/ortoo/node-redis-sentinel).

## Usage

```
$ git clone https://github.com/stoshiya/socket.io-redis-sample.git
$ cd socket.io-redis-sample

$ redis-server --port 6379 &
$ redis-server --port 6380 slaveof 127.0.0.1 6379 &
$ redis-sentinel ./conf/sentinel0.conf &
$ redis-sentinel ./conf/sentinel1.conf &

$ npm install
$ node app.js &
```

## License

MIT

