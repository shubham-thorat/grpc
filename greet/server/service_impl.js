const pb = require('../proto/greet_pb')
const RedisClient = require('./redis/redisClient');
const fs = require('node:fs')
const client = require('./statsD')
const helper = require('./helper')

class Count {
  static request_count = 0;
  static setInitial() {
    this.request_count = 0;
  }
  static increment() {
    this.request_count = this.request_count + 1
    return this.request_count
  }
  static getCount() {
    return this.request_count
  }
}


exports.healthCheck = (call, callback) => {
  // console.log('HEALTH CHECK IS CALLED');
  const res = new pb.HealthResponse()
    .setStatus(200)
    .setMessage('OK');
  calback(null, res)
}

exports.greet = (call, callback) => {
  console.log('Greet was invoked');
  const res = new pb.GreetResponse()
    .setResult(`Hello ${call.request.getFirstName()}`)
  callback(null, res);
}

exports.greetManyTimes = (call, _) => {
  console.log('greetManyTimes was invoked');
  const res = new pb.GreetResponse();

  for (let i = 0; i < 10; i++) {
    res.setResult(`Hello ${call.request.getFirstName()} - number ${i}`);
    call.write(res);
  }
  call.end();
}

exports.longGreet = (call, callback) => {
  console.log('longGreet was invoked');
  let greet = '';

  call.on('data', (chunk) => {
    console.log(`Data received ${chunk}`)
    greet += chunk;
  });

  call.on('end', () => {
    console.log(`Data received at end ${greet}`)
    const res = new pb.GreetResponse().setResult(greet);
    callback(null, res);
  })

}


exports.manyLongGreet = (call, calback) => {

  call.on('data', (req) => {
    console.log(`Request received ${req}`);
    const res = new pb.GreetResponse().setResult(`Hello ${req.getFirstName()}`)

    console.log(`Sending response ${res}`);
    call.write(res);
  })

  call.on('end', () => call.end());
}

exports.storeRedisData = (call, callback) => {
  const startTime = Date.now();
  client.timing('request_received', 1);
  call.on('data', (req) => {
    RedisClient.setKey(req.getKey(), req.getValue()).then(response => {
      let res;
      if (response) {
        res = new pb.RedisResponse()
          .setStatus(200)
          .setMessage('Redis Success');
      } else {
        res = new pb.RedisResponse()
          .setStatus(500)
          .setMessage('Redis Success Failed');
      }
      const endTime = Date.now();
      const timeRequired = endTime - startTime;
      Count.increment()

      const request_count = Count.getCount()

      console.log("REQUEST COUNT : ", request_count)

      client.timing('response_time', timeRequired);
      client.timing('request_end', 1)
      call.write(res);

    }).catch(error => {
      const res = new pb.RedisResponse()
        .setStatus(500)
        .setMessage(`Redis Success Failed Error - ${error}`);
      call.write(res)
    })
  })

  call.on('end', () => {
    call.end();
  });
}


//input load
//output metrices (for both client & server)
