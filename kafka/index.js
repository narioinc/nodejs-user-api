const { Kafka } = require('kafkajs')
const kafkaConfig = require("./config.js");

const kafka = new Kafka({
  clientId: kafkaConfig.KAFKA_CLIENTID,
  brokers: kafkaConfig.KAFKA_BROKERS.split(",")
})

const kafkaClient = {};

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: kafkaConfig.KAFKA_GROUPID })

producer.connect().then((data)=>{
  console.log(data)
}).catch((err)=>{
  console.log(err)
})
consumer.connect().then((data)=>{
  console.log(data)
}).catch((err)=>{
  console.log(err)
})

kafkaClient.producer = producer
kafkaClient.consumer = consumer

module.exports = kafkaClient;