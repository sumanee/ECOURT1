const sqlServ = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  server: `${process.env.DB_HOST}`,
  database: `${process.env.DB_NAME}`,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

module.exports.initialize = async () => {
  try {
    await new sqlServ.ConnectionPool(config);
    console.log(`ConnectionPool ${process.env.DB_NAME}`);
  } catch (err) {
    console.log(`Cannot ConnectionPool ${process.env.DB_NAME}`, err);
  }
};

module.exports.simpleExecute = (statement, binds = []) => {
  return new Promise(async (resolve, reject) => {
    let conn;

    try {
      conn = await new sqlServ.ConnectionPool(config).connect();
      const request = await conn.request();
      binds.forEach(function(p) {
        request.input(p.name, p.sqltype, p.value);
      });
      const result = await request.query(statement);
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
};
