const oracledb = require('oracledb')
const {connectionPool} = require('../config/config')
/**
  DBType can be store, stored or s
**/
module.exports.ExecuteProcedure = async (
  PackageName = '',
  DBType = '',
  DBParameters = {}
) => {
  let querySQL = '',
    paraInsert = '',
    conn,
    binds = {}

  try {
    conn = await oracledb.getConnection({
      user: connectionPool.user,
      password: connectionPool.password,
      connectString: connectionPool.connectionString,
    })
    paraInsert = convertToQueryFormatStr(DBParameters)
    switch (DBType.toUpperCase()) {
      case 'STORE':
      case 'STORED':
      case 'S':
        querySQL = `BEGIN ${PackageName}(${paraInsert}); END;`
        break
      //More type here
    }
    binds = {
      ...DBParameters,
      cv_1: {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR,
      },
    }
    const dataSet = await conn.execute(querySQL, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      resultSet: true,
    })
    const cursor = dataSet.outBinds['cv_1']
    const result = await cursor.getRow()
    return result
  } catch (error) {
    console.error(`Connect to database failed \n ${error}`)
  } finally {
    if (!conn) return false
    try {
      await conn.close() // close connection
      console.log('Connections are closed!')
    } catch (error) {
      console.log(error)
    }
  }
}
// Convert to format`:[key(s)], :sys_refcursor`
function convertToQueryFormatStr(param) {
  const mappedKey = Object.keys(param).map(key => `:${key}`)
  return [...mappedKey, ':cv_1'].join(', ')
}
