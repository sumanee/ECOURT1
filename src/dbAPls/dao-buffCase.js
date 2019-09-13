const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');
// CASEDATE, CASEDPTID, CASEMAINID, BLACKNO, REDNO, CASEDETAIL, CTEID, CTEDTE
const BuffCase = {
  SELECT: `SELECT FORMAT(CASEDTE, 'dd-MM-yyyy')  AS CASEDTE, CASEDPTID, CASEMAINID, 
    BLACKNO, REDNO, CASEDETAIL , CTEID, FORMAT(CTEDTE, 'dd-MM-yyyy hh:mm:ss') AS CTEDTE 
    FROM BUFF_CASE`,

  INSERT: ` INSERT INTO BUFF_CASE
    (CASEDTE, CASEDPTID, CASEMAINID, BLACKNO, REDNO, CASEDETAIL, CTEID, CTEDTE , STATE ) 
    OUTPUT FORMAT(INSERTED.CASEDTE, 'dd-MM-yyyy') AS CASEDTE,INSERTED.CASEDPTID,
    INSERTED.CASEMAINID,INSERTED.BLACKNO,INSERTED.REDNO,INSERTED.CASEDETAIL 
    VALUES(CAST(@CASEDTE AS DATE) , @CASEDPTID, @CASEMAINID,@BLACKNO,@REDNO,@CASEDETAIL,@CTEID, GETDATE(),'temp')`,

  // UPDATE: `UPDATE BUFF_CASE SET STATE = 'delete' ,  CTEDTE = GETDATE()   WHERE CTEID = @CTEID `,
  UPDATE: `UPDATE BUFF_CASE
  SET  CASEDTE = CAST(@CASEDTE AS DATE) , CASEDPTID = @CASEDPTID, CASEMAINID = @CASEMAINID,
  BLACKNO = @BLACKNO, REDNO = @REDNO, CASEDETAIL = @CASEDETAIL
  OUTPUT FORMAT(INSERTED.CASEDTE, 'dd-MM-yyyy') AS CASEDTE ,INSERTED.CASEDPTID,
  INSERTED.CASEMAINID,INSERTED.BLACKNO,INSERTED.REDNO,INSERTED.CASEDETAIL
  WHERE CTEID = @CTEID`,

  DELETE: `DELETE BUFF_CASE  WHERE CTEID = @CTEID`
};
/*    OUTPUT FORMAT(INSERTED.CASEDTE, 'dd-MM-yyyy') AS CASEDTE,INSERTED.CASEDPTID,
    INSERTED.CASEMAINID,INSERTED.BLACKNO,INSERTED.REDNO,INSERTED.CASEDETAIL */
let binds;
function setData(data) {
  binds = [
    { name: 'CASEDTE', sqltype: mssql.NVarChar, value: data.CASEDTE },
    { name: 'CASEDPTID', sqltype: mssql.Numeric, value: data.CASEDPTID },
    { name: 'CASEMAINID', sqltype: mssql.Numeric, value: data.CASEMAINID },
    { name: 'BLACKNO', sqltype: mssql.NVarChar, value: data.BLACKNO },
    { name: 'REDNO', sqltype: mssql.NVarChar, value: data.REDNO },
    { name: 'CASEDETAIL', sqltype: mssql.NVarChar, value: data.CASEDETAIL },
    { name: 'CTEID', sqltype: mssql.Numeric, value: data.CTEID }
  ];
}

module.exports.getCaseAll = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffCase.SELECT} ORDER BY CTEDTE DESC `;
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

module.exports.getCaseByCteId = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffCase.SELECT} WHERE CTEID = @CTEID `;
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

module.exports.insertCase = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffCase.INSERT}`;
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

module.exports.updateCase = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffCase.UPDATE}`;
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

module.exports.deleteCase = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffCase.DELETE}`;

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
