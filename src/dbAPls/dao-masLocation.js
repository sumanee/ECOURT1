const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const location = {
  SELECT: {
    PRV: `SELECT DISTINCT PRVID,PRVNME,STS FROM MS_LOCATION`,
    AMP: `SELECT DISTINCT PRVID,AMPID,PRVNME,AMPNME FROM MS_LOCATION`,
    FULL: `SELECT DISTINCT PRVID,AMPID,TMBID,PRVNME,AMPNME,TMBNME,STS FROM MS_LOCATION`
  },
  INSERT: ``,
  UPDATE: ``,
  DELETE: ``
};
//
module.exports.getListOfProvince = async (_prvId, _prvNme) => {
  try {
    const binds = [
      { name: 'PRVID', sqltype: mssql.VarChar, value: _prvId },
      { name: 'PRVNME', sqltype: mssql.VarChar, value: _prvNme }
    ];
    let sql = `${location.SELECT.PRV} WHERE STS <> 'D' `;

    if (_prvId && _prvId !== '') {
      sql = `${sql} AND PRVID = @PRVID`;
    }

    if (_prvNme && _prvNme !== '') {
      sql = `${sql} AND PRVNME LIKE '%${_prvNme}%' COLLATE Thai_BIN `;
    }

    sql = `${sql} ORDER BY PRVNME `;

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

module.exports.getListOfAmphur = async (_prvId, _ampId, _ampNme) => {
  try {
    const binds = [
      { name: 'PRVID', sqltype: mssql.VarChar, value: _prvId },
      { name: 'AMPID', sqltype: mssql.VarChar, value: _ampId },
      { name: 'AMPNME', sqltype: mssql.VarChar, value: _ampNme }
    ];
    let sql = `${location.SELECT.AMP} WHERE STS <> 'D' `;

    if (_prvId && _prvId !== '') {
      sql = `${sql} AND PRVID = @PRVID`;
    }

    if (_ampId && _ampId !== '') {
      sql = `${sql} AND AMPID = @AMPID`;
    }

    if (_ampNme && _ampNme !== '') {
      sql = `${sql} AND AMPNME LIKE '%${_ampNme}%' COLLATE Thai_BIN `;
    }

    sql = `${sql} ORDER BY PRVNME,AMPNME `;

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

module.exports.getListOfTumbon = async (_prvId, _ampId, _tmbId, _tmbNme) => {
  try {
    const binds = [
      { name: 'PRVID', sqltype: mssql.VarChar, value: _prvId },
      { name: 'AMPID', sqltype: mssql.VarChar, value: _ampId },
      { name: 'TMBID', sqltype: mssql.VarChar, value: _tmbId },
      { name: 'TMBNME', sqltype: mssql.VarChar, value: _tmbNme }
    ];
    let sql = `${location.SELECT.FULL} WHERE STS <> 'D' `;

    if (_prvId && _prvId !== '') {
      sql = `${sql} AND PRVID = @PRVID`;
    }

    if (_ampId && _ampId !== '') {
      sql = `${sql} AND AMPID = @AMPID`;
    }

    if (_tmbId && _tmbId !== '') {
      sql = `${sql} AND TMBID = @TMBID`;
    }

    if (_tmbNme && _tmbNme !== '') {
      sql = `${sql} AND TMBNME LIKE '%${_tmbNme}%' COLLATE Thai_BIN `;
    }

    sql = `${sql} ORDER BY PRVNME,AMPNME,TMBNME `;

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
