const { validationResult } = require('express-validator');
const dbAPls = require('../dbAPls/dao-buffCase');
const printlog = require('../utils/printLog');
const { getListJudge } = require('../controllers/ctl-buffJudge');
const { getListParty } = require('../controllers/ctl-buffParty');
const { getListPlantiff } = require('../controllers/ctl-buffPlantiff');
const { getListLawyer } = require('../controllers/ctl-buffLawyer');
const { getListWitness } = require('../controllers/ctl-buttWitness');

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

const insterData = async res => {
  try {
    const result = await dbAPls
      .insertCase(poDataArray)
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
const updateData = async res => {
  try {
    const result = await dbAPls
      .updateCase(poDataArray)
      .then(async data => {
        return data.rowsAffected;
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
const checkCase = async (req, res) => {
  try {
    setData(req.body);
    const result = await dbAPls
      .getCaseByCteId(poDataArray)
      .then(async data => {
        if (data.rowsAffected[0] > 0) {
          await updateData(poDataArray, res);
        } else {
          await insterData(poDataArray, res);
        }
        return data.rowsAffected[0];
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

module.exports.validateBuff = async (req, res, next) => {
  const errors = await validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    await checkCase(req, res);
    // res.end();
    next();
  }
};

module.exports.insertBuff = async (req, res, next) => {
  try {
    await insterData(req.body);
    if (req.body.JUDGELIST) {
      await buffJudge.insterDataJudge(req.body);
    }
    if (req.body.LAWYERLIST) {
    }
    if (req.body.PARTYLIST) {
    }
    if (req.body.PLAINTIFFLIST) {
    }
    if (req.body.WITNESSLIST) {
    }
    next();
  } catch (err) {
    // res.status(500).send({
    //   response: printlog.return_error(__filename, err.toString())
    // });
  }
};
module.exports.getDataBuff = async (req, res) => {
  try {
    setData(req.body);
    let _datarturn;
    await dbAPls
      .getCaseByCteId(poDataArray)
      .then(async data => {
        if (data.recordset && data.recordset.length > 0) {
          response = printlog.return_success(__filename);
          const _data = data.recordset[0];
          _datarturn = _data;

          const _dataJudge = await getListJudge(req, res);
          if (_dataJudge) {
            _datarturn.JUDGELIST = _dataJudge;
          }

          const _dataParty = await getListParty(req, res);
          if (_dataParty) {
            _datarturn.PARTYLIST = _dataParty;
          }

          const _dataPlantiff = await getListPlantiff(req, res);
          if (_dataParty) {
            _datarturn.PLAINTIFFLIST = _dataPlantiff;
          }

          const _dataLawyer = await getListLawyer(req, res);
          const _dataLawyerPrt = [];
          const _dataLawyerPlt = [];
          if (_dataLawyer) {
            _dataLawyer.map(element => {
              if (element.LAWTYPID === 1) {
                return _dataLawyerPrt.push(element);
              }
              if (element.LAWTYPID === 2) {
                return _dataLawyerPlt.push(element);
              }
            });
            if (_dataLawyerPrt) {
              _datarturn.LAWYERPRTLIST = _dataLawyerPrt;
            }
            if (_dataLawyerPlt) {
              _datarturn.LAWYERPLTLIST = _dataLawyerPlt;
            }
          }
          const _dataWitness = await getListWitness(req, res);
          if (_dataWitness) {
            _datarturn.WITNESSLIST = _dataWitness;
          }

          response.returndata = _datarturn;
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

module.exports.validateCaseBlack = async (req, res) => {
  try {
    const _date = await checkData(req, res);
    if (_date) {
      if (req.body.CTEID !== _date.CTEID) {
        response = printlog.return_waring(__filename);
        response.message = `Can't update data`;
        response.returndata = _date;
        res.status(200);
      } else {
        await updateData(poDataArray)
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
      await insterData(poDataArray)
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

const deleteData = async (req, res) => {
  try {
    setData(req.body);

    const result = await dbAPls
      .deleteCase(poDataArray)
      .then(data => {
        return data;
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
