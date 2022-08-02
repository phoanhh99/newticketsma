const httpStatus = require('http-status')
const {ExecuteProcedure} = require('../utils/databaseUtil')
const crypto = require('crypto')
const {token} = require('../config/config')
const jwt = require('jsonwebtoken')
module.exports.LOGIN = async (req, res, next) => {
  const rows = await ExecuteProcedure('PKG_TAIKHOAN.P_DANGNHAP', 'store', {
    v_TAIKHOAN: req.body.username,
    v_MATKHAU: crypto.createHash('md5').update(req.body.password).digest('hex'),
  })
  if (!rows) {
    res.json(httpStatus[`${httpStatus.NOT_FOUND}_MESSAGE`])
  }

  if (Object.keys(rows).includes('FAIL')) {
    res.json({
      type: 'fail',
      message: rows['FAIL'],
    })
  } else {
    res.json({
      type: 'success',
      message: 'Success, please wait for a sec',
      result: rows,
      jwttoken: jwt.sign({username: req.body.username}, token, {
        expiresIn: req.body.isRemember ? '1d' : '2h',
      }),
    })
  }
  next()
}

module.exports.GET_USERS = async (req, res, next) => {
  const rows = await ExecuteProcedure('PKG_CASE.GET_ALL_EMPLOYEE', 'store')
  if (!rows) {
    res.json(httpStatus[`${httpStatus.NOT_FOUND}_MESSAGE`])
  }

  if (Object.keys(rows).includes('FAIL')) {
    res.json({
      type: 'fail',
      message: rows['FAIL'],
    })
  } else {
    res.json({
      type: 'success',
      message: 'Success, please wait for a sec',
      result: rows,
    })
  }
  next()
}
