const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const apiRouter = require('./routes/api')
const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next){
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  if(!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({error: 'Unauthorized Request'})
  }

  next()

})

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use('api/', apiRouter)
app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'server error' }
  } else {
    console.error(error)
    response = { error: error.message, details: error }
  }
  res.status(500).json(response)
})

module.exports = app
