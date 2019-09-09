const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const lawyertyp = {
  SELECT: `SELECT LAWTYPID, LAWTYPCDE, LAWTYPDSC, STS FROM MS_LAWYERTYP`,
  INSERT: `INSERT INTO MS_LAWYERTYP (LAWTYPCDE, LAWTYPDSC, STS) VALUES (@LAWTYPCDE, @LAWTYPDSC, @STS)`,
  UPDATE: `UPDATE MS_LAWYERTYP SET LAWTYPCDE = @LAWTYPCDE , LAWTYPDSC = @LAWTYPDSC, STS = @STS WHERE LAWTYPID = @LAWTYPID`,
  DELETE: ``
};
//
module.exports.validateLawyerTyp = async _cde => {
  try {
    const binds = [{ name: 'LAWTYPCDE', sqltype: mssql.VarChar, value: _cde }];
    const sql = `${lawyertyp.SELECT} WHERE  LAWTYPCDE = @LAWTYPCDE  `;
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

module.exports.validateLawyerTypCde = async (_id, _cde) => {
  try {
    const binds = [
      { name: 'LAWTYPCDE', sqltype: mssql.VarChar, value: _cde },
      { name: 'LAWTYPID', sqltype: mssql.Numeric, value: _id }
    ];
    const sql = `${lawyertyp.SELECT} WHERE LAWTYPCDE = @LAWTYPCDE AND LAWTYPID <> @LAWTYPID `;
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

module.exports.getLawyerTypById = async _id => {
  try {
    const binds = [{ name: 'LAWTYPID', sqltype: mssql.Numeric, value: _id }];
    const sql = `${lawyertyp.SELECT} WHERE LAWTYPID = @LAWTYPID`;
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

module.exports.getListOfLawyerTyp = async _sts => {
  try {
    const binds = [{ name: 'STS', sqltype: mssql.VarChar, value: _sts }];
    const sql = `${lawyertyp.SELECT} WHERE STS = @STS`;
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

module.exports.searchLawyerTyp = async (_dsc, _sts) => {
  try {
    const binds = [
      { name: 'LAWTYPDSC', sqltype: mssql.VarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.VarChar, value: _sts }
    ];
    let sql = `${lawyertyp.SELECT} WHERE 1=1`;

    if (_dsc && _dsc !== '') {
      sql = `${sql} AND LAWTYPDSC LIKE '%${_dsc}%' COLLATE Thai_BIN `;
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

module.exports.insertLawyerTyp = async (_cde, _dsc, _sts) => {
  try {
    const binds = [
      { name: 'LAWTYPCDE', sqltype: mssql.NVarChar, value: _cde },
      { name: 'LAWTYPDSC', sqltype: mssql.NVarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.NVarChar, value: _sts }
    ];
    const sql = `${lawyertyp.INSERT}`;
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

module.exports.updateLawyerTyp = async (_id, _cde, _dsc, _sts) => {
  try {
    const binds = [
      { name: 'LAWTYPCDE', sqltype: mssql.NVarChar, value: _cde },
      { name: 'LAWTYPDSC', sqltype: mssql.NVarChar, value: _dsc },
      { name: 'STS', sqltype: mssql.NVarChar, value: _sts },
      { name: 'LAWTYPID', sqltype: mssql.Numeric, value: _id }
    ];
    const sql = `${lawyertyp.UPDATE}`;
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
