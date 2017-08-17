const KafkaAvro = require('kafka-avro')

var kafkaAvro = new KafkaAvro({
  kafkaBroker: 'http://localhost:9092',
  schemaRegistry: 'http://localhost:8081'
})

async function initProducer () {
  await kafkaAvro.init()
  return kafkaAvro.getProducer({
    'metadata.broker.list': 'localhost:9092'
  })
}

async function run () {
  const producer = await initProducer()
  producer.on('event.log', function (log) {
    console.log(log)
  })

  producer.on('event.error', function (err) {
    console.error('Error from producer')
    console.error(err)
  })

  producer.on('disconnected', function (arg) {
    console.log('producer disconnected. ' + JSON.stringify(arg))
  })

  const topic = producer.Topic('sample_topic', {
    'request.required.acks': 1
  })

  var message = {
    name: 'Thanasis',
    long: 540
  }

  producer.produce(topic, -1, message, 'key')
}

run()
