const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const ruuviSchema = new mongoose.Schema({
    tags: [
      {
        accelX: Number,
        accelY: Number,
        accelZ: Number,
        connectable: Boolean,
        createDate: Date,
        dataFormat: Number,
        defaultBackground: Number,
        favorite: Boolean,
        humidity: Number,
        humidityOffset: Number,
        id: String,
        measurementSequenceNumber: Number,
        movementCounter: Number,
        name: String,
        pressure: Number,
        rssi: Number,
        temperature: Number,
        txPower: Number,
        updateAt: String,
        voltage: Number
      }
    ],
    batteryLevel: Number,
    deviceId: String,
    eventId: String,
    time: String
})

ruuviSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.tags[0]._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Ruuvi', ruuviSchema)
