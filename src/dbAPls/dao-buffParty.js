const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

// PRTNO, TITLEID, IDCARDNO, PRTFNME, PRTLNME, ADR_HUSNO, ADR_MOO, ADR_VILLAGE,
// ADR_ROAD, ADR_ALLEY, LOCID, POSTCODE, COJCTL, ADR_TMBNME, ADR_AMPNME, ADR_PRVNME, CTEID, CTEDTE

const BuffParty = {
  SELECT: {
    ALL: `SELECT PRTNO, PRTFNME, PRTLNME, TITLEID,
      CTEID, FORMAT(CTEDTE, 'dd-MM-yyyy hh:mm:ss') AS CTEDTE FROM BUFF_PARTY`,
    COUNTMAX: `SELECT ISNULL(MAX(PRTNO),0)+1 AS PRTNO FROM BUFF_PARTY WHERE CTEID = @CTEID `
  },

  INSERT: `INSERT INTO BUFF_PARTY
   (PRTNO, PRTFNME, PRTLNME, TITLEID, CTEID, CTEDTE)
   OUTPUT INSERTED.PRTNO, INSERTED.CTEID
   VALUES(@PRTNO, @PRTFNME, @PRTLNME, @TITLEID,@CTEID, GETDATE())`,

  UPDATE: `UPDATE BUFF_PARTY
    SET PRTFNME = @PRTFNME, PRTLNME = @PRTLNME, TITLEID = @TITLEID,
    CTEID = @CTEID , CTEDTE = GETDATE() 
    OUTPUT INSERTED.PRTNO, INSERTED.CTEID
    WHERE CTEID = @CTEID  AND PRTNO = @PRTNO `,

  DELETE: `DELETE BUFF_PARTY `
};

let binds;
function setData(data) {
  binds = [
    { name: 'PRTNO', sqltype: mssql.Numeric, value: data.PRTNO },
    { name: 'PRTFNME', sqltype: mssql.NVarChar, value: data.PRTFNME },
    { name: 'PRTLNME', sqltype: mssql.NVarChar, value: data.PRTLNME },
    { name: 'TITLEID', sqltype: mssql.Numeric, value: data.TITLEID },
    { name: 'CTEID', sqltype: mssql.Numeric, value: data.CTEID }
  ];
}

const contMaxPartyNo = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffParty.SELECT.COUNTMAX}`;
    const result = await dbAPIS
      .simpleExecute(sql, binds)
      .then(data => {
        if (data.recordset[0]) {
          return data.recordset[0].PRTNO;
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
module.exports.getPartyByCteId = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffParty.SELECT.ALL} WHERE CTEID = @CTEID  `;

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
module.exports.getPartyByPartyNo = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffParty.SELECT.ALL} WHERE CTEID = @CTEID AND PRTNO = @PRTNO `;

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

module.exports.insertParty = async poDataArray => {
  try {
    const _newPRTNO = await contMaxPartyNo(poDataArray);

    binds[0] = { name: 'PRTNO', sqltype: mssql.Numeric, value: _newPRTNO };

    const sql = `${BuffParty.INSERT}`;
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

module.exports.updateParty = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffParty.UPDATE}`;
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

module.exports.deletePartyByNo = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffParty.DELETE} WHERE PRTNO = @PRTNO AND CTEID = @CTEID`;
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

module.exports.deletePartyByCteId = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffParty.DELETE} WHERE CTEID = @CTEID`;
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
