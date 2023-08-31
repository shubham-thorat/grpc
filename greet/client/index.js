const fs = require('fs');
const grpc = require('@grpc/grpc-js');
const { GreetServiceClient } = require('../proto/greet_grpc_pb'); //Client Stubs:
const { doGreet, doGreetManyTimes, doLongGreet, doManyLongGreet, dostoreRedisKey } = require('./apis');
const path = require('path');

function main() {
  const tls = true;
  let creds;
  if (tls) {
    const rootCert = fs.readFileSync(path.join(__dirname, '../../ssl/ca.crt'))
    const rootChain = fs.readFileSync(path.join(__dirname, '../../ssl/server.crt'));
    const privateKey = fs.readFileSync(path.join(__dirname, '../../ssl/server.pem')); //private key
    creds = grpc.ChannelCredentials.createSsl(null, privateKey, rootChain);
  } else {
    creds = grpc.ChannelCredentials.createInsecure();
  }

  const startTime = Date.now()

  for (let i = 0; i < 10; i++) {
    // dns:///question-service:40000

    const client = new GreetServiceClient('cb-stage-grpc-alb-533232360.ap-south-1.elb.amazonaws.com', creds)
    // const client = new GreetServiceClient('3.109.155.63:5051', creds)
    // const client = new GreetServiceClient('localhost:5051', creds)
    // console.log("channel : ", client.getChannel())
    //...client
    doGreet(client);
    // dostoreRedisKey(client);
  }

  // grpcurl - plaintext dns:///cb-stage-alb-grpc-63456560.ap-south-1.elb.amazonaws.com:5051
  const endTime = Date.now();

  console.log("Time Required", endTime - startTime);
  // dostoreRedisKey(client);
  // doGreetManyTimes(client);
  // doLongGreet(client);
  // doManyLongGreet(client);
  // client.close();
}

main();
