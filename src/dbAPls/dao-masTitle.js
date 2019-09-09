const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const title = {
  SELECT: `SELECT TITLEID,TITLECDE,TITLEDSC, STS FROM MS_TITLE`,
  INSERT: `INSERT INTO MS_TITLE (TITLECDE, TITLEDSC, STS) VALUES (@TITLECDE, @TITLEDSC, @STS)`,
  UPDATE: `UPDATE MS_TITLE SET TITLECDE = @TITLECDE , TITLEDSC = @TITLEDSC, STS = @STS WHERE TITLEID = @TITLEID`,
  DELETE: ``
};
//
module.exports.validateTitle = async _cde => {
  try {
    const binds = [{ name: 'TITLECDE', sqltype: mssql.VarChar, value: _cde }];
    const sql = `${title.SELECT} WHERE TITLECDE = @TITLECDE `;
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
module.exports.validateTitleCde = async (_id, _cde) => {
  try {
    const binds = [
      { name: 'TITLECDE', sqltype: mssql.VarChar, value: _cde },
      { name: 'TITLEID', sqltype: mssql.Numeric, value: _id }
    ];
    const sql = `${title.SELECT} WHERE TITLECDE = @TITLECDE AND TITLEID <> @TITLEID `;
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

module.exports.getTitleById = async _id => {
  try {
    const binds = [{ name: 'TITLEID', sqltype: mssql.Numeric, value: _id }];
    const sql = `${title.SELECT} WHERE TITLEID = @TITLEID`;
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

module.exports.getListOfTitle = async _sts => {
  try {
    const binds = [{ name: 'STS', sqltype: mssql.VarChar, value: _sts }];
    const sql = `${title.SELECT} WHERE STS = @STS`;
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

module.exports.searchTitle = async (_dsc, _sts) => {
  try {
    const binds = [
      { name: 'TITLEDSC', sqltype: mssql.VarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.VarChar, value: _sts }
    ];
    let sql = `${title.SELECT} WHERE 1=1`;

    if (_dsc && _dsc !== '') {
      sql = `${sql} AND TITLEDSC LIKE '%${_dsc}%' COLLATE Thai_BIN `;
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

module.exports.insertTitle = async (_cde, _dsc, _sts) => {
  console.log('insertTitle');
  try {
    const binds = [
      { name: 'TITLECDE', sqltype: mssql.NVarChar, value: _cde },
      { name: 'TITLEDSC', sqltype: mssql.NVarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.NVarChar, value: _sts }
    ];
    const sql = `${title.INSERT}`;
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

module.exports.updateTitle = async (_id, _cde, _dsc, _sts) => {
  try {
    const binds = [
      { name: 'TITLECDE', sqltype: mssql.NVarChar, value: _cde },
      { name: 'TITLEDSC', sqltype: mssql.NVarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.NVarChar, value: _sts },
      { name: 'TITLEID', sqltype: mssql.Numeric, value: _id }
    ];
    const sql = `${title.UPDATE}`;
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
