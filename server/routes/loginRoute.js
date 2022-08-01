const express = require('express')
const router = express.Router()
const loginController = require('../controllers/loginController')
const cors = require('cors')
const path = require('path')
const jwt = require('jsonwebtoken')

const {token} = require('../config/config')
require('dotenv').config({path: path.resolve(`${__dirname}../.env`)})

router.use(
  cors({
    origin: [`${process.env.CLIENT_URL}`],
    methods: ['get', 'post', 'put', 'delete'],
  })
)

router.get('/login', (req, res, next) => {
  const authHeader = req.headers['authorization']
  const reqtoken = authHeader && authHeader.split(' ')[1]
  if (reqtoken) {
    const decoded = jwt.verify(reqtoken, token)
    res.json({hasToken: decoded})
  } else {
    res.json({hasToken: ''})
  }
  next()
})
router.post('/login', loginController.LOGIN)
router.get('/userlist', loginController.GET_USERS)

module.exports = router
