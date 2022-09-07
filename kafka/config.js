module.exports = {
    KAFKA_BROKERS: process.env.KAFKA_HOST || "localhost:9092",
    KAFKA_CLIENTID: process.env.KAFKA_CLIENTID || "user_api",
    KAFKA_GROUPID: process.env.KAFKA_GROUPID  || "user_api",
    KAFKA_TOPIC: process.env.KAFKA_TOPIC  || "userapi",
};