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
module.exports.connect = async (statement, binds = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool1 = await new sqlServ.ConnectionPool(config).connect();
      const preparedStatement = await new sqlServ.PreparedStatement(pool1);
      preparedStatement.input('CTEID', sqlServ.Int);
      await preparedStatement.prepare(statement);
      const reslut = await preparedStatement
        .execute({ CTEID: 123 })
        .then(data => {
          return data;
          // console.log('data', data.recordset[0]);
        })
        .catch(err => {
          console.log('err', err);
        });
      resolve(reslut);
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};
module.exports.connect_1 = async (statement, binds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pool1 = await new sqlServ.ConnectionPool(config).connect();
      const preparedStatement = await new sqlServ.PreparedStatement(pool1);
      preparedStatement.input('JUDNO', sqlServ.Int);
      preparedStatement.input('CTEID', sqlServ.Int);
      console.log('insert');

      await preparedStatement.prepare(statement);
      const reslut = await preparedStatement
        .execute({ JUDNO: binds, CTEID: 123 })
        .then(data => {
          return data;
          // console.log('data', data.recordset[0]);
        })
        .catch(err => {
          console.log('err', err);
        });
      resolve(reslut);
    } catch (err) {
      reject(err);
    } finally {
    }
  });
};
module.exports.simpleExecute = (statement, binds = []) => {
  return new Promise(async (resolve, reject) => {
    let conn;

    try {
      conn = await new sqlServ.ConnectionPool(config).connect();
      const request = await conn.request();
      await binds.forEach(async p => {
        await request.input(p.name, p.sqltype, p.value);
      });
      const result = await request.query(statement);
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
};
