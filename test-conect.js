const sqlServ = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const config = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  server: `${process.env.DB_HOST}`,
  database: `${process.env.DB_NAME}`,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};
const connect = async (_data, pool1) => {
  console.log('connect');

  const preparedStatement = await new sqlServ.PreparedStatement(pool1);

  preparedStatement.input('CTEID', sqlServ.Int);

  await preparedStatement.prepare(
    'SELECT ISNULL(MAX(JUDNO),0)+1 AS JUDNO FROM BUFF_JUDGE WHERE CTEID = @CTEID'
  );
  const reslut = await preparedStatement
    .execute({ CTEID: 123 })
    .then(async data => {
      console.log('data', data.recordset[0].JUDNO);
      const preparedStatement1 = await new sqlServ.PreparedStatement(pool1);
      preparedStatement1.input('JUDNO', sqlServ.Int);
      preparedStatement1.input('CTEID', sqlServ.Int);

      await preparedStatement1.prepare(
        `INSERT INTO BUFF_JUDGE
        (JUDNO, CTEID, CTEDTE)  
        OUTPUT INSERTED.JUDNO ,INSERTED.JUDFNME , INSERTED.JUDLNME , INSERTED.TITLEID
        VALUES(@JUDNO,@CTEID, GETDATE())`
      );
      const reslutinsert = await preparedStatement1
        .execute({ JUDNO: data.recordset[0].JUDNO, CTEID: 123 })
        .then(a => {
          console.log('_data', a.recordset);
        })
        .catch(err => {
          console.log('err', err);
        });
    })
    .catch(err => {
      console.log('err', err);
    });
};

const data = [
  {
    JUDNO: 0,
    JUDFNME: 'JAVASCRIPT',
    TITLEID: '2',
    JUDLNME: '3',
    CTEID: 123
  },
  {
    JUDNO: 0,
    JUDFNME: 'CSS',
    JUDLNME: '3',
    TITLEID: '2',
    CTEID: 123
  }
];
data.forEach(async _data => {
  const pool1 = await new sqlServ.ConnectionPool(config).connect();
  await connect(
    _data,
    pool1
  );
});

// const ps = new sqlServ.PreparedStatement(pool1);
// ps.input('param', sqlServ.Int);
// ps.prepare('select @param as value', err => {
//   // ... error checks

//   ps.execute({ param: 12345 }, (err, result) => {
//     // ... error checks

//     // release the connection after queries are executed
//     ps.unprepare(err => {
//       // ... error checks
//     });
//   });
// });
