const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

//  WITNO, WITTYP, IDCARDNO, TITLEID, WITFNME, WITLNME, RELATION, OCCUPATION, BIRTHDAY, AGE,
//  NATIONALITY, RACE, ADR_HUSNO, ADR_MOO, ADR_VILLAGE, ADR_ROAD, ADR_ALLEY, ADDRESS, LOCID,
//  POSTCODE, CTEID, CTEDTE 22

const BuffWitness = {
  SELECT: {
    ALL: `SELECT  WITNO, WITTYP, TITLEID, WITFNME, WITLNME, RELATION, IDCARDNO, OCCUPATION, BIRTHDAY, AGE,
    NATIONALITY, RACE, ADR_HUSNO, ADR_MOO, ADR_VILLAGE, ADR_ROAD, ADR_ALLEY, ADDRESS, LOCID,  
    POSTCODE,CTEID, FORMAT(CTEDTE, 'dd-MM-yyyy hh:mm:ss') AS CTEDTE 
    FROM BUFF_WITNESS`,
    COUNTMAX: `SELECT ISNULL(MAX(WITNO),0)+1 AS WITNO FROM BUFF_WITNESS WHERE CTEID = @CTEID `
  },

  INSERT: `INSERT INTO BUFF_WITNESS
   (WITNO, WITTYP, IDCARDNO, TITLEID, WITFNME, WITLNME, RELATION, OCCUPATION, BIRTHDAY, AGE,
    NATIONALITY, RACE, ADR_HUSNO, ADR_MOO, ADR_VILLAGE, ADR_ROAD, ADR_ALLEY, ADDRESS, LOCID,
    POSTCODE, CTEID, CTEDTE)
   OUTPUT INSERTED.WITNO, INSERTED.CTEID
   VALUES(@WITNO, @WITTYP, @IDCARDNO, @TITLEID, @WITFNME, @WITLNME, @RELATION, @OCCUPATION, @BIRTHDAY, @AGE,
    @NATIONALITY, @RACE, @ADR_HUSNO, @ADR_MOO, @ADR_VILLAGE, @ADR_ROAD, @ADR_ALLEY, @ADDRESS, @LOCID,
    @POSTCODE, @CTEID,  GETDATE())`,

  UPDATE: `UPDATE BUFF_WITNESS
    SET WITFNME = @WITFNME, WITLNME = @WITLNME, TITLEID = @TITLEID,
    WITTYP = @WITTYP, IDCARDNO = @IDCARDNO , TITLEID = @TITLEID, RELATION = @RELATION,
    OCCUPATION = @OCCUPATION, BIRTHDAY =@BIRTHDAY, AGE = @AGE,  NATIONALITY = @NATIONALITY, RACE = @RACE, 
    ADR_HUSNO = @ADR_HUSNO, ADR_MOO = @ADR_MOO, ADR_VILLAGE = @ADR_VILLAGE, ADR_ROAD = @ADR_ROAD,
    ADR_ALLEY = @ADR_ALLEY, ADDRESS = @ADDRESS, LOCID = @LOCID,
    CTEID = @CTEID , CTEDTE = GETDATE() 
    OUTPUT INSERTED.WITNO, INSERTED.CTEID
    WHERE CTEID = @CTEID  AND WITNO = @WITNO `,

  DELETE: `DELETE BUFF_WITNESS `
};
//  WITNO, WITTYP, IDCARDNO, TITLEID, WITFNME, WITLNME, RELATION, OCCUPATION, BIRTHDAY, AGE,
//  NATIONALITY, RACE, ADR_HUSNO, ADR_MOO, ADR_VILLAGE, ADR_ROAD, ADR_ALLEY, ADDRESS, LOCID,
//  POSTCODE, CTEID, CTEDTE 22
let binds;
function setData(data) {
  binds = [
    { name: 'WITNO', sqltype: mssql.Numeric, value: data.WITNO },
    { name: 'TITLEID', sqltype: mssql.Numeric, value: data.TITLEID },
    { name: 'WITTYP', sqltype: mssql.Numeric, value: data.WITTYP },
    { name: 'IDCARDNO', sqltype: mssql.NVarChar, value: data.IDCARDNO },
    { name: 'WITFNME', sqltype: mssql.NVarChar, value: data.WITFNME },
    { name: 'WITLNME', sqltype: mssql.NVarChar, value: data.WITLNME },

    { name: 'RELATION', sqltype: mssql.NVarChar, value: data.RELATION },
    { name: 'OCCUPATION', sqltype: mssql.NVarChar, value: data.OCCUPATION },
    { name: 'BIRTHDAY', sqltype: mssql.NVarChar, value: data.BIRTHDAY },
    { name: 'AGE', sqltype: mssql.Numeric, value: data.AGE },
    { name: 'NATIONALITY', sqltype: mssql.NVarChar, value: data.NATIONALITY },
    { name: 'RACE', sqltype: mssql.NVarChar, value: data.RACE },
    { name: 'ADR_HUSNO', sqltype: mssql.NVarChar, value: data.ADR_HUSNO },
    { name: 'ADR_MOO', sqltype: mssql.NVarChar, value: data.ADR_MOO },
    { name: 'ADR_VILLAGE', sqltype: mssql.NVarChar, value: data.ADR_VILLAGE },
    { name: 'ADR_ROAD', sqltype: mssql.NVarChar, value: data.ADR_ROAD },
    { name: 'ADR_ALLEY', sqltype: mssql.NVarChar, value: data.ADR_ALLEY },
    { name: 'ADDRESS', sqltype: mssql.NVarChar, value: data.ADDRESS },
    { name: 'LOCID', sqltype: mssql.NVarChar, value: data.LOCID },
    { name: 'POSTCODE', sqltype: mssql.NVarChar, value: data.POSTCODE },
    { name: 'CTEID', sqltype: mssql.Numeric, value: data.CTEID }
  ];
}

const contMaxWitnessNo = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffWitness.SELECT.COUNTMAX}`;
    const result = await dbAPIS
      .simpleExecute(sql, binds)
      .then(data => {
        if (data.recordset[0]) {
          return data.recordset[0].WITNO;
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
module.exports.getWitnessByCteId = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffWitness.SELECT.ALL} WHERE CTEID = @CTEID  `;

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
module.exports.getWitnessByWitnessNo = async poDataArray => {
  try {
    await setData(poDataArray);
    const sql = `${BuffWitness.SELECT.ALL} WHERE CTEID = @CTEID AND WITNO = @WITNO `;

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

module.exports.insertWitness = async poDataArray => {
  try {
    const _newWitNo = await contMaxWitnessNo(poDataArray);

    binds[0] = { name: 'WITNO', sqltype: mssql.Numeric, value: _newWitNo };

    const sql = `${BuffWitness.INSERT}`;
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

module.exports.updateWitness = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${BuffWitness.UPDATE}`;
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

module.exports.deleteWitnessByNo = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffWitness.DELETE} WHERE WITNO = @WITNO AND CTEID = @CTEID`;
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

module.exports.deleteWitnessByCteId = async poDataArray => {
  try {
    setData(poDataArray);
    const sql = `${BuffWitness.DELETE} WHERE CTEID = @CTEID`;
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
