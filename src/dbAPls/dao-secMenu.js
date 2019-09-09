const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const SEC_MENU = {
  SELECT: `SELECT MENUID, MENUCDE, MENUCTL, ASSIGNID, MENUNAME, MENUSERV, ICON, STS FROM SEC_MENU`,
  INSERT: ``,
  UPDATE: ``,
  DELETE: ``
};

let binds = [];

function setData(data) {
  binds = [
    { name: 'MENUID', sqltype: mssql.Numeric, value: data.menuid },
    { name: 'MENUCDE', sqltype: mssql.Numeric, value: data.menucde },
    { name: 'MENUCTL', sqltype: mssql.Numeric, value: data.menuctl },
    { name: 'ASSIGNID', sqltype: mssql.Numeric, value: data.assignid },
    { name: 'MENUNAME', sqltype: mssql.NVarChar, value: data.menuname },
    { name: 'MENUSERV', sqltype: mssql.NVarChar, value: data.menuserv },
    { name: 'ICON', sqltype: mssql.NVarChar, value: data.icon },
    { name: 'STS', sqltype: mssql.NVarChar, value: data.sts }
  ];
}

module.exports.getMenuByAssignId = async poDataArray => {
  try {
    await setData(poDataArray);

    const sql = `${SEC_MENU.SELECT} WHERE STS = 'E' AND ASSIGNID = @ASSIGNID ORDER BY MENUCTL, MENUCDE`;
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
