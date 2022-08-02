const express = require('express')
const app = express()
const {webConfig} = require('./config/config')
const oracledb = require('oracledb')
const bodyParser = require('body-parser')

app.use(bodyParser.json()) // to support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})) // to support encoded bodies

app.use('/api', require('./routes/loginRoute'))

app.listen(webConfig.port, webConfig.ip, err => {
  if (err) {
    console.log(
      `Unable to listen, there might be something wrong with the connection`
    )
    process.exitCode(1)
  }
  console.log(
    `Server is listening on: \n\r http://${webConfig.ip}:${webConfig.port}`
  )
  initDB()
})

function initDB() {
  console.log('Initialing database module')
  //Tell node oracledb to find the default path
  if (process.platform === 'win32') {
    // if not set, node-oracledb will try to find path inside ~/node_modules/oracledb/build/release/*
    try {
      oracledb.initOracleClient()
      console.log('OracleDB loaded !')
    } catch (error) {
      console.log(error)
      process.exitCode(1)
    }
  }
}
