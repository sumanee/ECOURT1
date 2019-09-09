const dbAPls = require('../dbAPls/dao-buffJudge');
const printlog = require('../utils/printLog');

let response;
let poDataArray;
function setData(data) {
  poDataArray = {
    // JUDNO, JUDFNME, JUDLNME, CTEID, CTEDTE
    JUDNO: data.JUDNO ? data.JUDNO : 0,
    JUDFNME: data.JUDFNME ? data.JUDFNME : null,
    JUDLNME: data.JUDLNME ? data.JUDLNME : null,
    TITLEID: data.TITLEID ? data.TITLEID : null,
    CTEID: data.CTEID ? data.CTEID : 0
  };
}

const validateJudge = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .getJudgeByJudgeNo(poDataArray)
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
const showJudgeByCaseId = async (req, res, next) => {
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
      .getJudgeByCaseId(poDataArray)
      .then(data => {
        if (data.recordset.length > 0) req.dataJudge = data.recordset;

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

const deleteJudgeByCaseId = async (req, res, next) => {
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

module.exports.updateJudge = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
    // console.log(req.body);

    for (let i = 0; i < req.body.length; i++) {
      // console.log('element', req.body[i]);
      const _return = dbAPls.insertJudge(req.body[i]);
      // console.log('_return', _return);

      // .then(async data => {
      //   if (data.rowsAffected[0] === 1) {
      //     response = printlog.return_success(__filename);
      //     const _datareturn = data.recordset[0];
      //     response.returndata = _datareturn;
      //     res.status(200);
      //   }
      // })
      // .catch(err => {
      //   res.status(500).send({
      //     response: printlog.return_error(__filename, err.toString())
      //   });
      // });
    }
    /*  req.body.forEach(async element => {
      if (!element.CTEID) {
        res.status(400).send({
          response: printlog.return_error(__filename, 'Error request cteId')
        });
      }
      // console.log('element', element);
      const _date = await validateJudge(element, res);
      if (_date) {
      } else {
        // console.log('element', element);
        const _return = await dbAPls
          .insertJudge(element)
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
    }); */

    //

    // if (_date) {
    //   if (req.body.CASEID !== _date.CASEID) {
    //     response = printlog.return_waring(__filename);
    //     response.message = `Can't update data`;
    //     response.returndata = _date;
    //     res.status(200);
    //   } else {
    //     await dbAPls
    //       .updateJudge(poDataArray)
    //       .then(async data => {
    //         if (data.rowsAffected[0] === 1) {
    //           response = printlog.return_success(__filename);
    //           const _datareturn = data.recordset[0];
    //           response.returndata = _datareturn;
    //           res.status(200);
    //         }
    //       })
    //       .catch(err => {
    //         res.status(500).send({
    //           response: printlog.return_error(__filename, err.toString())
    //         });
    //       });
    //   }
    // } else {
    //   await dbAPls
    //     .insertJudge(poDataArray)
    //     .then(async data => {
    //       if (data.rowsAffected[0] === 1) {
    //         response = printlog.return_success(__filename);
    //         const _datareturn = data.recordset[0];
    //         response.returndata = _datareturn;
    //         res.status(200);
    //       }
    //     })
    //     .catch(err => {
    //       res.status(500).send({
    //         response: printlog.return_error(__filename, err.toString())
    //       });
    //     });
    // }

    // res.send({ response });
    res.end();
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.getJudgeByCteId = async (req, res) => {
  try {
    if (!req.body) {
      response = printlog.return_reqBody(__filename);
      res.status(400).send({ response });
    }
    setData(req.body);
    await dbAPls
      .getJudgeByCteId(poDataArray)
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

module.exports.getJudgeByCaseId = async (req, res, next) => {
  try {
    await showJudgeByCaseId(req, res, next);

    if (req.dataJudge) {
      response = printlog.return_success(__filename);
      response.returndata = req.dataJudge;
    } else {
      response = printlog.return_waring(__filename);
      response.returndata = `Can't data found`;
    }
    res.status(200);
    res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.deleteJudgeById = async (req, res) => {
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
      .deleteJudgeById(poDataArray)
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

module.exports.deleteJudgeByCaseId = async (req, res) => {
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
      .deleteJudgeByCaseId(poDataArray)
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
