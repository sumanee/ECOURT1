const dbAPls = require('../dbAPls/dao-masCaseMain');
const printlog = require('../utils/printLog');

let _id;
let _dsc;
let _sts;
let response;
let _cde;

const validateCaseMain = async (req, res) => {
  try {
    if (req.body) _cde = req.body.CASEMAINCDE ? req.body.CASEMAINCDE : '';

    const result = await dbAPls
      .validateCaseMain(_cde)
      .then(data => {
        if (data.rowsAffected[0] === 0) {
          return true;
        }
        return false;
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

module.exports.validateCaseMainCde = async (req, res, next) => {
  try {
    if (req.body) _id = req.body.CASEMAINID ? req.body.CASEMAINID : 0;
    if (req.body) _cde = req.body.CASEMAINCDE ? req.body.CASEMAINCDE : '';

    await dbAPls
      .validateCaseMainCde(_id, _cde)
      .then(data => {
        if (data.rowsAffected[0] === 0) {
          next();
        } else {
          response = printlog.return_waring(__filename);
          response.message = `ข้อมูล ${_cde} แล้ว`;
          response.returndata = data.recordset;
          res.status(200);
          return res.send({ response });
        }
      })
      .catch(err => {
        return res.status(500).send({
          response: printlog.return_error(__filename, err.toString())
        });
      });
    return;
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.getCaseMainById = async (req, res) => {
  try {
    if (req.body) _id = req.body.CASEMAINID ? req.body.CASEMAIN : 0;

    await dbAPls
      .getCaseMainById(_id)
      .then(data => {
        if (data.recordset) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_error(__filename);
          res.status(500);
        }
        return res.send({ response });
      })
      .catch(err => {
        return res.status(500).send({
          response: printlog.return_error(__filename, err.toString())
        });
      });
    return;
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.getListOfCaseMain = async (req, res) => {
  try {
    await dbAPls
      .getListOfCaseMain('E')
      .then(data => {
        if (data.recordset) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_error(__filename);
          res.status(500);
        }
        return res.send({ response });
      })
      .catch(err => {
        return res.status(500).send({
          response: printlog.return_error(__filename, err.toString())
        });
      });
    return;
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.searchCaseMain = async (req, res) => {
  try {
    if (req.body) _dsc = req.body.CASEMAINDSC ? req.body.CASEMAINDSC : null;
    if (req.body) _sts = req.body.STS ? req.body.STS : null;

    await dbAPls
      .searchCaseMain(_dsc, _sts)
      .then(data => {
        if (data.recordset) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_error(__filename);
          res.status(500);
        }
        return res.send({ response });
      })
      .catch(err => {
        return res.status(500).send({
          response: printlog.return_error(__filename, err.toString())
        });
      });
    return;
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.updateCaseMain = async (req, res) => {
  try {
    if (req.body) _id = req.body.CASEMAINID ? req.body.CASEMAINID : '';
    if (req.body) _dsc = req.body.CASEMAINDSC ? req.body.CASEMAINDSC : '';
    if (req.body) _sts = req.body.STS ? req.body.STS : 'E';
    if (req.body) _cde = req.body.CASEMAINCDE ? req.body.CASEMAINCDE : '';

    if (_id !== '') {
      await dbAPls // _id, _cde, _dsc, _sts
        .updateCaseMain(_id, _cde, _dsc, _sts)
        .then(data => {
          if (data.rowsAffected[0] === 1) {
            response = printlog.return_success(__filename);

            res.status(200);
          } else {
            response = printlog.return_error(__filename);
            res.status(500);
          }
          return res.send({ response });
        })
        .catch(err => {
          return res.status(500).send({
            response: printlog.return_error(__filename, err.toString())
          });
        });
      return;
    }
    const _chk = await validateCaseMain(req, res);

    if (_chk) {
      await dbAPls
        .insertCaseMain(_cde, _dsc, _sts)
        .then(data => {
          if (data.rowsAffected[0] === 1) {
            response = printlog.return_success(__filename);
            res.status(200);
          } else {
            response = printlog.return_error(__filename);
            res.status(500);
          }
          return res.send({ response });
        })
        .catch(err => {
          return res.status(500).send({
            response: printlog.return_error(__filename, err.toString())
          });
        });
      return;
    }
    response = printlog.return_waring(__filename);
    response.message = `ข้อมูล ${_cde} แล้ว`;
    res.status(200);
    return res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};
