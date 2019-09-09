const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');
// LAWNO, LAWTYPID, LAWFNME, LAWLNME, TITLEID, CTEID, CTEDTE
const BuffLawyer = {
  SELECT: {
    ALL: `SELECT LAWNO, LAWTYPID, LAWFNME, LAWLNME, TITLEID, CTEID,
      FORMAT(CTEDTE, 'dd-MM-yyyy hh:mm:ss')  AS CTEDTE FROM BUFF_LAWYER `,
    COUNTMAX: `SELECT ISNULL(MAX(LAWNO),0)+1 AS LAWNO FROM BUFF_LAWYER WHERE CTEID = @CTEID`
  },
  UPDATE: `UPDATE BUFF_LAWYER SET LAWTYPID = @LAWTYPID , LAWFNME = @LAWFNME , TITLEID = @TITLEID
  OUTPUT INSERTED.LAWNO, INSERTED.LAWTYPID, 
  INSERTED.LAWFNME, INSERTED.LAWLNME, INSERTED.TITLEID 
  WHERE CTEID = @CTEID AND LAWNO = @LAWNO `,

  INSERT: `INSERT INTO BUFF_LAWYER 
  ( LAWNO, LAWTYPID, LAWFNME, LAWLNME, TITLEID, CTEID , CTEDTE  )
  OUTPUT  INSERTED.LAWID, INSERTED.LAWNO,  INSERTED.LAWTYPID, 
  INSERTED.LAWFNME, INSERTED.LAWLNME, INSERTED.TITLEID 
  VALUES (@LAWNO , @LAWTYPID, @LAWFNME, @LAWLNME, @TITLEID, @CTEID, GETDATE() ) `,
  DELETE: `DELETE FROM BUFF_LAWYER`
};
let binds;
function setData(data) {
  binds = [
    { name: 'LAWNO', sqltype: mssql.Numeric, value: data.LAWNO },
    { name: 'LAWTYPID', sqltype: mssql.Numeric, value: data.LAWTYPID },
    { name: 'LAWFNME', sqltype: mssql.NVarChar, value: data.LAWFNME },
    { name: 'LAWLNME', sqltype: mssql.NVarChar, value: data.LAWLNME },
    { name: 'TITLEID', sqltype: mssql.Numeric, value: data.TITLEID },
    { name: 'CTEID', sqltype: mssql.NVarChar, value: data.CTEID }
  ];
}

const contMaxLawyerNo = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffLawyer.SELECT.COUNTMAX}`;
    const result = await dbAPIS
      .simpleExecute(sql, binds)
      .then(data => {
        if (data.recordset[0]) {
          return data.recordset[0].LAWNO;
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

module.exports.getLawyerByCaseId = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffLawyer.SELECT.ALL} WHERE CASEID = @CASEID`;
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

module.exports.getLawyerById = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffLawyer.SELECT.ALL} WHERE LAWID = @LAWID`;

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

module.exports.insertLawyer = async poDataArray => {
  try {
    const _newlawno = await contMaxLawyerNo(poDataArray);
    binds[1] = { name: 'LAWNO', sqltype: mssql.Numeric, value: _newlawno };
    const sql = `${BuffLawyer.INSERT}`;
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

module.exports.updateLawyer = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffLawyer.UPDATE}`;
    const result = await dbAPIS
      .simpleExecute(sql, binds)
      .then(data => {
        console.log('data', data);

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

module.exports.deleteLawyerById = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffLawyer.DELETE} WHERE LAWID = @LAWID`;

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

module.exports.deleteLawyerByCaseId = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffLawyer.DELETE} WHERE CASEID = @CASEID`;

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
