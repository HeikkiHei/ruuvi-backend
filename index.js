const express = require('express')
const app = express()
require('dotenv').config()
const Ruuvi = require('./models/ruuvi')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h>Try /api/ruuvis instead!!</h>')
})

app.get('/api/ruuvis', (request, response) => {
  Ruuvi.find({}).then(ruuvis => {
    response.json(ruuvis.map(ruuvi => ruuvi.toJSON()))
  })
})

app.post('/api/ruuvis', (request, response) => {
  const body = request.body
  console.log('Sending this body:\n', body)
  if (body.tags === undefined) {
    return response.status(400).json({ error: 'tags missing' })
  }

  const ruuvi = new Ruuvi({
    tags: [
      {
        accelX: body.tags[0].accelX,
        accelY: body.tags[0].accelY,
        accelZ: body.tags[0].accelZ,
        connectable: body.tags[0].connectable,
        createDate: body.tags[0].createDate,
        dataFormat: body.tags[0].dataFormat,
        defaultBackground: body.tags[0].defaultBackground,
        favorite: body.tags[0].favorite,
        humidity: body.tags[0].humidity,
        humidityOffset: body.tags[0].humidityOffset,
        id: body.tags[0].id,
        measurementSequenceNumber: body.tags[0].measurementSequenceNumber,
        movementCounter: body.tags[0].movementCounter,
        name: body.tags[0].name,
        pressure: body.tags[0].pressure,
        rssi: body.tags[0].rssi,
        temperature: body.tags[0].temperature,
        txPower: body.tags[0].txPower,
        updateAt: body.tags[0].updateAt,
        voltage: body.tags[0].voltage
      }
    ],
    batteryLevel: body.batteryLevel,
    deviceId: body.deviceId,
    eventId: body.eventId,
    time: body.time
  })

  ruuvi.save().then(savedRuuvi => {
    response.json(savedRuuvi.toJSON())
  })
})

app.get('/api/ruuvis/:id', (request, response, next) => {
  Ruuvi.findById(request.params.id)
    .then(ruuvi => {
      if (ruuvi) {
        response.json(ruuvi.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/ruuvis/:id', (request, response, next) => {
  Ruuvi.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
