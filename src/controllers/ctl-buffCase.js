const dbAPls = require('../dbAPls/dao-buffCase');
const printlog = require('../utils/printLog');

let response;
let poDataArray;
function setData(data) {
  poDataArray = {
    CASEDTE: data.CASEDTE ? data.CASEDTE : null,
    CASEMAINID: data.CASEMAINID ? data.CASEMAINID : null,
    CASEDPTID: data.CASEDPTID ? data.CASEDPTID : null,
    BLACKNO: data.BLACKNO ? data.BLACKNO : null,
    REDNO: data.REDNO ? data.REDNO : null,
    CASEDETAIL: data.CASEDETAIL ? data.CASEDETAIL : null,
    CTEID: data.CTEID ? data.CTEID : null
  };
}

const validateCase = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }

    setData(req.body);
    const result = await dbAPls
      .getCaseByCteId(poDataArray)
      .then(data => {
        return data.recordset[0];
      })
      .catch(err => {
        return res.status(500).send({
          response: printlog.return_error(__filename, err.toString())
        });
      });

    return result;
  } catch (err) {
    return res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.updateCase = async (req, res) => {
  try {
    const _date = await validateCase(req, res);
    if (_date) {
      if (req.body.CTEID !== _date.CTEID) {
        response = printlog.return_waring(__filename);
        response.message = `Can't update data`;
        response.returndata = _date;
        res.status(200);
      } else {
        await dbAPls
          .updateCase(poDataArray)
          .then(async data => {
            if (data.rowsAffected[0] === 1) {
              const _datareturn = data.recordset[0];
              response = printlog.return_success(__filename);
              response.returndata = _datareturn;
              res.status(200);
            }
          })
          .catch(err => {
            res.status(500).send({
              response: printlog.return_error(__filename, err.toString())
            });
          });
      }
    } else {
      await dbAPls
        .insertCase(poDataArray)
        .then(async data => {
          if (data.rowsAffected[0] === 1) {
            response = printlog.return_success(__filename);
            const _datareturn = data.recordset[0];
            response.message = 'Save Data Success';
            response.returndata = _datareturn;
            res.status(200);
          }
        })
        .catch(err => {
          res.status(500).send({
            response: printlog.return_error(__filename, err.toString())
          });
        });
    }

    res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.getCaseByCteId = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
    setData(req.body);
    await dbAPls
      .getCaseByCteId(poDataArray)
      .then(data => {
        if (data.recordset && data.recordset.length > 0) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_waring(__filename);
          response.returndata = `Can't data found`;
          res.status(200);
        }
      })
      .catch(err => {
        response = printlog.return_error(__filename, err.toString());
        res.status(500);
      });
    res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.getCaseAll = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
    setData(req.body);
    await dbAPls
      .getCaseAll(poDataArray)
      .then(data => {
        if (data.recordset && data.recordset.length > 0) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_waring(__filename);
          response.returndata = `Can't data found`;
          res.status(200);
        }
      })
      .catch(err => {
        response = printlog.return_error(__filename, err.toString());
        res.status(500);
      });
    res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.deleteCase = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
    setData(req.body);

    await dbAPls
      .deleteCase(poDataArray)
      .then(async data => {
        if (data.rowsAffected[0] === 1) {
          response = printlog.return_success(__filename);
          response.message = `Delete data success`;
          res.status(200);
        } else {
          response = printlog.return_waring(__filename);
          response.message = `Can't delete data`;
          res.status(200);
        }
      })
      .catch(err => {
        res.status(500).send({
          response: printlog.return_error(__filename, err.toString())
        });
      });

    res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};
