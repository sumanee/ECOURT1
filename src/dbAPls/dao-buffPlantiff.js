const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

// PLTNO, TITLEID, IDCARDNO, PLTFNME, PLTLNME, ADR_HUSNO, ADR_MOO, ADR_VILLAGE,
// ADR_ROAD, ADR_ALLEY, LOCID, POSTCODE, COJCTL, ADR_TMBNME, ADR_AMPNME, ADR_PRVNME, CTEID, CTEDTE

const BuffPlantiff = {
  SELECT: {
    ALL: `SELECT PLTNO, PLTFNME, PLTLNME, TITLEID,
      CTEID, FORMAT(CTEDTE, 'dd-MM-yyyy hh:mm:ss') AS CTEDTE FROM BUFF_PLAINTIFF`,
    COUNTMAX: `SELECT ISNULL(MAX(PLTNO),0)+1 AS PLTNO FROM BUFF_PLAINTIFF WHERE CTEID = @CTEID `
  },

  INSERT: `INSERT INTO BUFF_PLAINTIFF
   (PLTNO, PLTFNME, PLTLNME, TITLEID, CTEID, CTEDTE)
   OUTPUT INSERTED.PLTNO, INSERTED.CTEID
   VALUES(@PLTNO, @PLTFNME, @PLTLNME, @TITLEID,@CTEID, GETDATE())`,

  UPDATE: `UPDATE BUFF_PLAINTIFF
    SET PLTFNME = @PLTFNME, PLTLNME = @PLTLNME, TITLEID = @TITLEID,
    CTEID = @CTEID , CTEDTE = GETDATE() 
    OUTPUT INSERTED.PLTNO, INSERTED.CTEID
    WHERE CTEID = @CTEID  AND PLTNO = @PLTNO `,

  DELETE: `DELETE BUFF_PLAINTIFF `
};

let binds;
function setData(data) {
  binds = [
    { name: 'PLTNO', sqltype: mssql.Numeric, value: data.PLTNO },
    { name: 'PLTFNME', sqltype: mssql.NVarChar, value: data.PLTFNME },
    { name: 'PLTLNME', sqltype: mssql.NVarChar, value: data.PLTLNME },
    { name: 'TITLEID', sqltype: mssql.Numeric, value: data.TITLEID },
    { name: 'CTEID', sqltype: mssql.Numeric, value: data.CTEID }
  ];
}

const contMaxPlantiffNo = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffPlantiff.SELECT.COUNTMAX}`;
    const result = await dbAPIS
      .simpleExecute(sql, binds)
      .then(data => {
        if (data.recordset[0]) {
          return data.recordset[0].PLTNO;
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
module.exports.getPlantiffByCteId = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffPlantiff.SELECT.ALL} WHERE CTEID = @CTEID  `;

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
module.exports.getPlantiffByPlantiffNo = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffPlantiff.SELECT.ALL} WHERE CTEID = @CTEID AND PLTNO = @PLTNO `;

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

module.exports.insertPlantiff = async poDataArray => {
  try {
    const _newPltNo = await contMaxPlantiffNo(poDataArray);

    binds[0] = { name: 'PLTNO', sqltype: mssql.Numeric, value: _newPltNo };

    const sql = `${BuffPlantiff.INSERT}`;
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

module.exports.updatePlantiff = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffPlantiff.UPDATE}`;
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

module.exports.deletePlantiffByNo = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffPlantiff.DELETE} WHERE PLTNO = @PLTNO AND CTEID = @CTEID`;
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

module.exports.deletePlantiffByCteId = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffPlantiff.DELETE} WHERE CTEID = @CTEID`;
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
