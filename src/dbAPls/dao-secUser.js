const mssql = require('mssql');
const dbAPIS = require('../services/database');
const { writeLog } = require('../utils/printLog');

const SEC_USER = {
  SELECT: `SELECT USRID, USRCDE, PASSWD, FIRNME, LASNME, PHN, EMAIL, POSITION,
  a.ASSIGNID, a.TITLEID, a.DPTID, a.STS, CHKLGN, TOKEN, a.DTEAMN, a.UIDAMN,
  b.TITLENME, c.ASSIGNDSC, d.DPTNME
  FROM SEC_USER a
  LEFT JOIN MS_TITLE b ON a.TITLEID = b.TITLEID
  LEFT JOIN SEC_USERASSIGN c ON a.ASSIGNID = c.ASSIGNID
  LEFT JOIN MS_DEPT d ON a.DPTID = d.DPTID
  ORDER BY USRCDE `,
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
