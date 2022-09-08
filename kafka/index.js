const { Kafka } = require('kafkajs')
const kafkaConfig = require("./config.js");
const { v4: uuidv4 } = require('uuid');

const kafka = new Kafka({
  clientId: kafkaConfig.KAFKA_CLIENTID,
  brokers: kafkaConfig.KAFKA_BROKERS.split(",")
})

const kafkaClient = {};

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: kafkaConfig.KAFKA_GROUPID })

producer.connect().then((data)=>{
  console.log("producer connected")
}).catch((err)=>{
  console.log(err)
})
consumer.connect().then((data)=>{
  console.log("consumer connected")
}).catch((err)=>{
  console.log(err)
})

kafkaClient.sendActionMessage = function(action, payload, traceId = uuidv4()) {
  console.log("Sending message to topic :: " + kafkaConfig.KAFKA_TOPIC)
  message = { "traceId": traceId, "action": action, "payload": payload, "timestamp": Date.now() }
  if(action){
    producer.send({
      topic: kafkaConfig.KAFKA_TOPIC,
      messages: [
        {
          key: null, value: JSON.stringify(message)
        }
      ],
    }).then(()=>{
      console.log("action message sent successfully")
    })
    .catch((err)=>{
      console.log(err)
    })
  }else{
    console.log("Action not specified")
  }
}

kafkaClient.producer = producer
kafkaClient.consumer = consumer

module.exports = kafkaClient;