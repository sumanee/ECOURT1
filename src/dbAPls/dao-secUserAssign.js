const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const SEC_USERASSIGN = {
  SELECT: `SELECT ASSIGNID, ASSIGNCDE, ASSIGNDSC, STS  FROM SEC_USERASSIGN`,
  INSERT: `INSERT INTO SEC_USERASSIGN (ASSIGNCDE, ASSIGNDSC, STS, CTEDTE, CTEID) VALUES (@ASSIGNCDE, @ASSIGNDSC, @STS, GETDATE(), @CTEID)`,
  UPDATE: `UPDATE SEC_USERASSIGN SET ASSIGNCDE = @ASSIGNCDE, ASSIGNDSC = @ASSIGNDSC, STS = @STS, UPDDTE = GETDATE(), UPDID = @CTEID WHERE ASSIGNID = @ASSIGNID`,
  DELETE: ``
};

let binds;

function setData(data) {
  binds = [
    { name: 'ASSIGNID', sqltype: mssql.Numeric, value: data.ASSIGNID },
    { name: 'ASSIGNCDE', sqltype: mssql.NVarChar, value: data.ASSIGNCDE },
    { name: 'ASSIGNDSC', sqltype: mssql.NVarChar, value: data.ASSIGNDSC },
    { name: 'STS', sqltype: mssql.NVarChar, value: data.STS },
    { name: 'CTEID', sqltype: mssql.Numeric, value: data.CTEID }
  ];
}

module.exports.validateUserAssign = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_USERASSIGN.SELECT} WHERE ASSIGNCDE = @ASSIGNCDE  `;
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
module.exports.validateUserAssignCde = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_USERASSIGN.SELECT} WHERE  ASSIGNCDE = @ASSIGNCDE AND ASSIGNID <> @ASSIGNID `;
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

module.exports.getUserAssignById = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_USERASSIGN.SELECT} WHERE ASSIGNID = @ASSIGNID`;
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

module.exports.getListOfUserAssign = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_USERASSIGN.SELECT} WHERE STS = @STS`;
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

module.exports.searchUserAssign = async poDataArray => {
  try {
    await setData(poDataArray);

    let sql = `${SEC_USERASSIGN.SELECT} WHERE 1=1`;

    if (poDataArray.assigncde && poDataArray.assigncde !== '') {
      sql = `${sql} AND ASSIGNCDE LIKE '%${poDataArray.assigncde}%' COLLATE Thai_BIN `;
    }

    if (poDataArray.assigndsc && poDataArray.assigndsc !== '') {
      sql = `${sql} AND ASSIGNDSC LIKE '%${poDataArray.assigndsc}%' COLLATE Thai_BIN `;
    }

    if (poDataArray.sts && poDataArray.sts !== '') {
      sql = `${sql} AND STS = @STS`;
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

module.exports.insertUserAssign = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_USERASSIGN.INSERT}`;
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

module.exports.updateUserAssign = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_USERASSIGN.UPDATE}`;
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
