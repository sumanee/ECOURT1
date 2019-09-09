const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const SEC_LOGACCESS = {
  SELECT: `SELECT LOGID, USRID, ACTION, ACTIONTIME, IPADDR FROM SEC_LOGACCESS`,
  INSERT: `INSERT INTO SEC_LOGACCESS (USRID, ACTION, ACTIONTIME, IPADDR) VALUES (@USRID, @ACTION, GETDATE(), @IPADDR)`,
  UPDATE: ``,
  DELETE: ``
};

let binds;

function setData(data) {
  binds = [
    { name: 'USRID', sqltype: mssql.Numeric, value: data.USRID },
    { name: 'ACTION', sqltype: mssql.NVarChar, value: data.ACTION },
    {
      name: 'STRACTIONTIME',
      sqltype: mssql.NVarChar,
      value: data.STRACTIONTIME
    },
    {
      name: 'ENDACTIONTIME',
      sqltype: mssql.NVarChar,
      value: data.ENDACTIONTIME
    },
    { name: 'IPADDR', sqltype: mssql.NVarChar, value: data.IPADDR }
  ];
}

module.exports.insertSecLogaccess = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_LOGACCESS.INSERT}`;
    const result = await dbAPIS
      .simpleExecute(sql, binds)
      .then(data => {
        return data;
      })
      .catch(err => {
        return writeLog(__filename, err.toString());
      });
    return result;
  } catch (err) {
    return writeLog(__filename, err.toString());
  }
};

module.exports.searchSecLogaccess = async poDataArray => {
  try {
    await setData(poDataArray);

    let sql = `${SEC_LOGACCESS.SELECT} WHERE 1=1`;

    if (poDataArray.usrid && poDataArray.usrid !== 0) {
      sql = `${sql} AND USRID = @USRID`;
    }

    if (poDataArray.action && poDataArray.action !== '') {
      sql = `${sql} AND ACTION LIKE '%${poDataArray.action}%' COLLATE Thai_BIN `;
    }

    if (poDataArray.stractiontime && poDataArray.stractiontime !== '') {
      if (poDataArray.endactiontime && poDataArray.endactiontime !== '') {
        sql = `${sql} AND replace( convert(varchar, ACTIONTIME, 23),'-','') >= @STRACTIONTIME`;
        sql = `${sql} AND replace( convert(varchar, ACTIONTIME, 23),'-','') <= @ENDACTIONTIME`;
      } else {
        sql = `${sql} AND replace( convert(varchar, ACTIONTIME, 23),'-','') = @STRACTIONTIME`;
      }
    }

    if (poDataArray.ipaddr && poDataArray.ipaddr !== '') {
      sql = `${sql} AND IPADDR LIKE '%${poDataArray.ipaddr}%' COLLATE Thai_BIN `;
    }

    const result = await dbAPIS
      .simpleExecute(sql, binds)
      .then(data => {
        return data;
      })
      .catch(err => {
        return writeLog(__filename, err.toString());
      });
    return result;
  } catch (err) {
    return writeLog(__filename, err.toString());
  }
};
