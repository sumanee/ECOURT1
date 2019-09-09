const dbAPls = require('../dbAPls/dao-buffLawyer');
const printlog = require('../utils/printLog');

let response;
let poDataArray;
function setData(data) {
  poDataArray = {
    // LAWID, LAWNO, CASEID, LAWTYPID, LAWFNME, LAWLNME, TITLEID, CTEID, CTEDTE, UPDID, UPDDTE, STS
    LAWID: data.LAWID ? data.LAWID : 0,
    LAWNO: data.LAWNO ? data.LAWNO : 0,
    CASEID: data.CASEID ? data.CASEID : 0,
    LAWTYPID: data.LAWTYPID ? data.LAWTYPID : 0,
    LAWFNME: data.LAWFNME ? data.LAWFNME : null,
    LAWLNME: data.LAWLNME ? data.LAWLNME : null,
    TITLEID: data.TITLEID ? data.TITLEID : null,
    CTEID: data.CTEID ? data.CTEID : 0,
    UPDID: data.UPDID ? data.UPDID : 0,
    STS: data.STS ? data.STS : null
  };
}

const validateLawyer = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }

    if (!req.body.CASEID) {
      res.status(400).send({
        response: printlog.return_error(__filename, 'Error request caseId')
      });
    }

    setData(req.body);

    const result = await dbAPls
      .getLawyerById(poDataArray)
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
const showLawyerByCaseId = async (req, res, next) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }

    if (!req.body.CASEID) {
      res.status(400).send({
        response: printlog.return_error(__filename, 'Error request caseId')
      });
    }
    setData(req.body);
    const result = await dbAPls
      .getLawyerByCaseId(poDataArray)
      .then(data => {
        if (data.recordset.length > 0) req.dataLawyer = data.recordset;

        next();
      })
      .catch(err => {
        response = printlog.return_error(__filename, err.toString());
        res.status(500);
      });
    return result;
  } catch (err) {
    return res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

const deleteLawyerByCaseId = async (req, res, next) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
  } catch (err) {
    return res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.updateLawyer = async (req, res) => {
  try {
    const _date = await validateLawyer(req, res);

    if (_date) {
      if (req.body.CASEID !== _date.CASEID) {
        response = printlog.return_waring(__filename);
        response.message = `Can't update data`;
        response.returndata = _date;
        res.status(200);
      } else {
        await dbAPls
          .updateLawyer(poDataArray)
          .then(async data => {
            if (data.rowsAffected[0] === 1) {
              response = printlog.return_success(__filename);
              const _datareturn = data.recordset[0];
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
        .insertLawyer(poDataArray)
        .then(async data => {
          if (data.rowsAffected[0] === 1) {
            response = printlog.return_success(__filename);
            const _datareturn = data.recordset[0];
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

module.exports.getLawyerByCteId = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
    setData(req.body);
    await dbAPls
      .getLawyerByCteId(poDataArray)
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

module.exports.getLawyerByCaseId = async (req, res, next) => {
  try {
    await showLawyerByCaseId(req, res, next);

    if (req.dataLawyer) {
      response = printlog.return_success(__filename);
      response.returndata = req.dataLawyer;
    } else {
      response = printlog.return_waring(__filename);
      response.message = `Can't data found`;
    }
    res.status(200);
    res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.deleteLawyerById = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }

    if (!req.body.JUDID) {
      res.status(400).send({
        response: printlog.return_error(__filename, 'Error request judid')
      });
    }
    setData(req.body);

    await dbAPls
      .deleteLawyerById(poDataArray)
      .then(async data => {
        if (data.rowsAffected[0] === 1) {
          response = printlog.return_success(__filename);
          res.status(200);
        } else {
          response = printlog.return_waring(__filename);
          response.returndata = `Can't delete data`;
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

module.exports.deleteLawyerByCaseId = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
    if (!req.body.CASEID) {
      res.status(400).send({
        response: printlog.return_error(__filename, 'Error request caseid')
      });
    }
    setData(req.body);

    await dbAPls
      .deleteLawyerByCaseId(poDataArray)
      .then(async data => {
        if (data.rowsAffected[0] === 1) {
          response = printlog.return_success(__filename);
          res.status(200);
        } else {
          response = printlog.return_waring(__filename);
          response.returndata = `Can't delete data`;
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
