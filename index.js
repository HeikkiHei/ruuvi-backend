const express = require('express')
const app = express()
require('dotenv').config()
const Ruuvi = require('./models/ruuvi')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/api/ruuvis', (request, response) => {
  Ruuvi.find({}).then(ruuvis => {
    response.json(ruuvis.map(ruuvi => ruuvi.toJSON()))
  })
})

app.post('/api/ruuvis', (request, response) => {
  const body = request.body
  console.log('THIS IS BODY', body)
  if (body.tags === undefined || body.location === undefined) {
    return response.status(400).json({ error: 'tags or location missing' })
  }

  const ruuvi = new Ruuvi({
    tags: [
      {
        accelX: body.tags.accelX,
        accelY: body.tags.accelY,
        accelZ: body.tags.accelZ,
        createDate: body.tags.createDate,
        dataFormat: body.tags.dataFormat,
        defaultBackground: body.tags.defaultBackground,
        favorite: body.tags.favorite,
        humidity: body.tags.humidity,
        id: body.tags.id,
        measurementSequenceNumber: body.tags.measurementSequenceNumber,
        movementCounter: body.tags.movementCounter,
        name: body.tags.name,
        pressure: body.tags.pressure,
        rssi: body.tags.rssi,
        temperature: body.tags.temperature,
        txPower: body.tags.txPower,
        updateAt: body.tags.updateAt,
        voltage: body.tags.voltage
      }
    ],
    batteryLevel: body.batteryLevel,
    deviceId: body.deviceId,
    eventId: body.eventId,
    location: {
      accuracy: body.location.accuracy,
      latitude: body.location.latitude,
      longitude: body.location.longitude
    },
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

app.put('/api/ruuvis/:id', (request, response, next) => {
  const body = request.body

  const ruuvi = {
    tags: [
      {
        accelX: body.tags.accelX,
        accelY: body.tags.accelY,
        accelZ: body.tags.accelZ,
        createDate: body.tags.createDate,
        dataFormat: body.tags.dataFormat,
        defaultBackground: body.tags.defaultBackground,
        favorite: body.tags.favorite,
        humidity: body.tags.humidity,
        id: body.tags.id,
        measurementSequenceNumber: body.tags.measurementSequenceNumber,
        movementCounter: body.tags.movementCounter,
        name: body.tags.name,
        pressure: body.tags.pressure,
        rssi: body.tags.rssi,
        temperature: body.tags.temperature,
        txPower: body.tags.txPower,
        updateAt: body.tags.updateAt,
        voltage: body.tags.voltage
      }
    ],
    batteryLevel: body.batteryLevel,
    deviceId: body.deviceId,
    eventId: body.eventId,
    location: {
      accuracy: body.location.accuracy,
      latitude: body.location.latitude,
      longitude: body.location.longitude
    },
    time: body.time
  }

  Ruuvi.findByIdAndUpdate(request.params.id, ruuvi, { new: true })
    .then(updatedRuuvi => {
      response.json(updatedRuuvi.toJSON())
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
