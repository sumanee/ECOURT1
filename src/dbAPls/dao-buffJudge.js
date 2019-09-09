const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const BuffJudge = {
  // JUDNO, JUDFNME, JUDLNME, CTEID, CTEDTE
  SELECT: {
    ALL: `SELECT JUDNO, JUDFNME, JUDLNME, TITLEID,
      CTEID, FORMAT(CTEDTE, 'dd-MM-yyyy hh:mm:ss') AS CTEDTE FROM BUFF_JUDGE`,
    COUNTMAX: `SELECT ISNULL(MAX(JUDNO),0)+1 AS JUDNO FROM BUFF_JUDGE WHERE CTEID = @CTEID `
  },

  INSERT: `INSERT INTO BUFF_JUDGE
    (JUDNO, CTEID, CTEDTE)  
    OUTPUT INSERTED.JUDNO ,INSERTED.JUDFNME , INSERTED.JUDLNME , INSERTED.TITLEID
    VALUES(@JUDNO,@CTEID, GETDATE())`,

  UPDATE: `UPDATE BUFF_JUDGE
    SET JUDFNME = @JUDFNME, JUDLNME = @JUDLNME, TITLEID = @TITLEID
    CTEID = @CTEID , CTEDTE = GETDATE() 
    OUTPUT INSERTED.JUDNO ,INSERTED.JUDFNME , INSERTED.JUDLNME , INSERTED.TITLEID
    WHERE CTEID = @CTEID  AND JUDNO = @JUDNO `,

  DELETE: `DELETE BUFF_JUDGE `
};
// INSERT: `INSERT INTO BUFF_JUDGE
// (JUDNO, JUDFNME, JUDLNME, TITLEID, CTEID, CTEDTE)
// OUTPUT INSERTED.JUDNO ,INSERTED.JUDFNME , INSERTED.JUDLNME , INSERTED.TITLEID
// VALUES(@JUDNO, @JUDFNME, @JUDLNME, @TITLEID,@CTEID, GETDATE())`,
let binds;
function setData(data) {
  binds = [
    { name: 'JUDNO', sqltype: mssql.Numeric, value: data.JUDNO },
    { name: 'JUDFNME', sqltype: mssql.NVarChar, value: data.JUDFNME },
    { name: 'JUDLNME', sqltype: mssql.NVarChar, value: data.JUDLNME },
    { name: 'TITLEID', sqltype: mssql.Numeric, value: data.TITLEID },
    { name: 'CTEID', sqltype: mssql.Numeric, value: data.CTEID }
  ];
}
const contMaxJudgeNo = async poDataArray => {
  console.log('contMaxJudgeNo');

  try {
    setData(poDataArray);
    const sql = `${BuffJudge.SELECT.COUNTMAX}`;
    const result = await dbAPIS
      .connect(sql, binds)
      .then(data => {
        if (data.recordset[0]) {
          console.log('recordset', data.recordset[0]);
          return data.recordset[0].JUDNO;
        }
        return 0;
      })
      .catch(err => {
        return writeLog(__filename, err.toString());
      });
    return result;
  } catch (err) {
    return writeLog(__filename, err.toString());
  }
};

module.exports.getJudgeByJudgeNo = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffJudge.SELECT.ALL} WHERE CTEID = @CTEID AND JUDNO = @JUDNO `;

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

module.exports.insertJudge = async poDataArray => {
  try {
    const _newjudno = await contMaxJudgeNo(poDataArray)
      .then(async _data => {
        console.log('_data', _data);
        const sql = `${BuffJudge.INSERT}`;
        const result = await dbAPIS
          .connect_1(sql, _data)
          .then(data => {
            console.log('data', data);
            return data;
          })
          .catch(err => {
            return writeLog(__filename, err.toString());
          });
      })
      .catch(err => {
        console.log('err', err);
      });

    return _newjudno;
  } catch (err) {
    return writeLog(__filename, err.toString());
  }
};

module.exports.updateJudge = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffJudge.UPDATE}`;
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

module.exports.deleteJudgeByJudNo = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffJudge.DELETE} WHERE JUDNO = @JUDNO AND CTEID = @CTEID`;

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
