const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const dept = {
  SELECT: `SELECT DPTID, DPTCDE, DPTNME, DPTSHTNME, DPTLEV, DPTCTL, DOCOFCCDE, DPTTYP, ENGSHTNME, STS, 
        DPTFLG, UIDAMN, DTEAMN FROM MS_DEPT`
};

module.exports.getDeptByCde = async _cde => {
  try {
    const binds = [{ name: 'DPTCDE', sqltype: mssql.VarChar, value: _cde }];
    const sql = `${dept.SELECT} WHERE DPTCDE = @DPTCDE`;
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
module.exports.getDeptById = async _id => {
  try {
    const binds = [{ name: 'DPTID', sqltype: mssql.Numeric, value: _id }];
    const sql = `${dept.SELECT} WHERE DPTID = @DPTID`;
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

module.exports.getListOfDept = async _sts => {
  try {
    const binds = [{ name: 'STS', sqltype: mssql.VarChar, value: _sts }];
    const sql = `${dept.SELECT} WHERE STS = @STS ORDER BY DPTNME`;
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

module.exports.searchDept = async (_id, _name) => {
  try {
    const binds = [
      { name: 'DPTID', sqltype: mssql.VarChar, value: _id },
      { name: 'DPTNME', sqltype: mssql.VarChar, value: _name }
    ];
    let sql = `${dept.SELECT} WHERE 1=1`;

    if (_id && _id !== '') {
      sql = `${sql} AND DPTID LIKE '${_id}%' COLLATE Thai_BIN `;
    }

    if (_name && _name !== '') {
      sql = `${sql} AND DPTNME LIKE '${_name}%' COLLATE Thai_BIN`;
    }
    sql = `${sql} ORDER BY DPTCDE,DPTNME`;
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
