const path = require('path')
const dotenvPath = path.resolve(`${__dirname}../../.env`)
require('dotenv').config({path: dotenvPath})

module.exports = {
  webConfig: {
    port: process.env.PORT || '5000',
    ip: process.env.IP || 'localhost',
    baseUrl: process.env.URL || 'http://localhost:3000',
  },
  connectionPool: {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionString: process.env.DB_CONN,
  },
  token: 'dragondeeznutheheh',
}
