const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const casemain = {
  SELECT: `SELECT CASEMAINID, CASEMAINCDE, CASEMAINDSC, STS FROM MS_CASEMAIN`,
  INSERT: `INSERT INTO MS_CASEMAIN (CASEMAINCDE, CASEMAINDSC, STS) VALUES (@CASEMAINCDE, @CASEMAINDSC, @STS)`,
  UPDATE: `UPDATE MS_CASEMAIN SET CASEMAINCDE = @CASEMAINCDE , CASEMAINDSC = @CASEMAINDSC, STS = @STS WHERE CASEMAINID = @CASEMAINID`,
  DELETE: ``
};

module.exports.validateCaseMain = async _cde => {
  try {
    const binds = [
      { name: 'CASEMAINCDE', sqltype: mssql.VarChar, value: _cde }
    ];
    const sql = `${casemain.SELECT} WHERE  CASEMAINCDE = @CASEMAINCDE  `;
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
module.exports.validateCaseMainCde = async (_id, _cde) => {
  try {
    const binds = [
      { name: 'CASEMAINCDE', sqltype: mssql.VarChar, value: _cde },
      { name: 'CASEMAINID', sqltype: mssql.Numeric, value: _id }
    ];
    const sql = `${casemain.SELECT} WHERE  CASEMAINCDE = @CASEMAINCDE AND CASEMAINID <> @CASEMAINID `;
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

module.exports.getCaseMainById = async _id => {
  try {
    const binds = [{ name: 'CASEMAINID', sqltype: mssql.Numeric, value: _id }];
    const sql = `${casemain.SELECT} WHERE CASEMAINID = @CASEMAINID`;
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

module.exports.getListOfCaseMain = async _sts => {
  try {
    const binds = [{ name: 'STS', sqltype: mssql.VarChar, value: _sts }];
    const sql = `${casemain.SELECT} WHERE STS = @STS`;
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

module.exports.searchCaseMain = async (_dsc, _sts) => {
  try {
    const binds = [
      { name: 'CASEMAINDSC', sqltype: mssql.VarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.VarChar, value: _sts }
    ];
    let sql = `${casemain.SELECT} WHERE 1=1`;

    if (_dsc && _dsc !== '') {
      sql = `${sql} AND CASEMAINDSC LIKE '%${_dsc}%' COLLATE Thai_BIN `;
    }

    if (_sts && _sts !== '') {
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

module.exports.insertCaseMain = async (_cde, _dsc, _sts) => {
  console.log('insertCaseMain');
  try {
    const binds = [
      { name: 'CASEMAINCDE', sqltype: mssql.NVarChar, value: _cde },
      { name: 'CASEMAINDSC', sqltype: mssql.NVarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.NVarChar, value: _sts }
    ];
    const sql = `${casemain.INSERT}`;
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

module.exports.updateCaseMain = async (_id, _cde, _dsc, _sts) => {
  try {
    const binds = [
      { name: 'CASEMAINCDE', sqltype: mssql.NVarChar, value: _cde },
      { name: 'CASEMAINDSC', sqltype: mssql.NVarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.NVarChar, value: _sts },
      { name: 'CASEMAINID', sqltype: mssql.Numeric, value: _id }
    ];
    const sql = `${casemain.UPDATE}`;
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
