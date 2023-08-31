const { GreetRequest, RedisRequest } = require('../proto/greet_pb'); //Service Descriptors

exports.doGreet = (client) => {
  console.log('doGreet is invoked');

  const req = new GreetRequest().setFirstName('Shubham');

  client.greet(req, (err, res) => {
    if (err) {
      return console.log(err)
    }

    console.log(`Response Greet: ${res.getResult()}`);
  })
}

exports.doGreetManyTimes = (client) => {
  const key = '';
  const req = new GreetRequest().setFirstName('Shubham');

  console.log('dostoreRedisKey client was called');

  const call = client.greetManyTimes(req);

  call.on('data', (res) => {
    console.log(`Greet Many times ${res.getResult()}`)
  })
}

exports.doLongGreet = (client) => {
  const names = ['shubham', 'shubham1', 'shubham2'];
  console.log("doLongGreet was called");

  const call = client.longGreet((err, res) => {
    console.log("doLongGreet requst is made");
    if (err) {
      console.error(JSON.stringify({
        "error": err,
        "method": 'doLongGreet'
      }))
      return console.log(err)
    }
    console.log(JSON.stringify({
      msg: 'success doLongGreet',
      value: res.getResult()
    }))
  })


  names.map((name) => {
    return new GreetRequest().setFirstName(name);
  }).forEach(req => call.write(req));

  call.end();
}


exports.doManyLongGreet = (client) => {
  const names = ['shubham', 'shubham1', 'shubham2'];
  console.log("doLongGreet was called");

  const call = client.manyLongGreet();

  call.on('data', (res) => {
    console.log(`Result doManyLongGreet - ${res.getResult()}`)
  })

  names.map((name) => {
    return new GreetRequest().setFirstName(name);
  }).forEach(req => call.write(req));

  call.end();
}


exports.dostoreRedisKey = (client) => {
  const call = client.storeRedisData();
  // string type = 1;
  // string key = 2;
  // string value = 3;
  // string count = 4;
  // string filename = 5;


  call.on('error', (err) => {
    console.log("Error occureed", err)
  })


  call.on('data', (res) => {

    console.log(JSON.stringify({
      status: res.getStatus(),
      message: res.getMessage()
    }))
  })

  let data = new Array(2).fill({
    "type": "11",
    "key": "redis_key",
    "value": "redis_value",
    "count": "500000"
  })

  data.map((item, index) => {
    return new RedisRequest()
      .setType(item.type)
      .setKey(item.key)
      .setValue(item.value)
  }).forEach(req => call.write(req))

  call.end();

}