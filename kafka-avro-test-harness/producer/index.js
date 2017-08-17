const KafkaAvro = require('kafka-avro')
const Guid = require('guid')
var prompt = require('prompt')

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

  continuePromptingForUserInput((message) => {
    console.log(`sending message: ${message}`)

    var body = {
      message
    }

    producer.produce(topic, -1, body, Guid.create().toString())
  })
}

function continuePromptingForUserInput (cb) {
  prompt.get(['message'], function (err, result) {
    cb(result.message)
    if (result.message === 'exit') {
      console.log('exiting')
    } else {
      continuePromptingForUserInput(cb)
    }
  })
}

run()
