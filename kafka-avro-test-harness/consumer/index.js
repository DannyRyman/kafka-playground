const KafkaAvro = require('kafka-avro')

var kafkaAvro = new KafkaAvro({
  kafkaBroker: 'localhost:9092',
  schemaRegistry: 'http://localhost:8081'
})

kafkaAvro.init().then(() => {
  kafkaAvro.getConsumer({
    'group.id': 'librd-test',
    'socket.keepalive.enable': true,
    'enable.auto.commit': true
  }) // the "getConsumer()" method will return a bluebird promise.
  .then(function (consumer) {
      // Topic Name can be a string, or an array of strings
    const topicName = 'sample_topic'

    var stream = consumer.getReadStream(topicName, {
      waitInterval: 0
    })

    stream.on('error', function () {
      process.exit(1)
    })

    consumer.on('error', function (err) {
      console.log(err)
      process.exit(1)
    })

    stream.on('data', function (dataRaw) {
      console.log('Received message:', dataRaw)
    })
  })
})
