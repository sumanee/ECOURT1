const dbAPls = require('../dbAPls/dao-masLocation');
const printlog = require('../utils/printLog');

let _prvId;
let _prvNme;
let _ampId;
let _ampNme;
let _tmbId;
let _tmbNme;
//
module.exports.getListOfProvince = async (req, res) => {
  try {
    if (req.body) _prvId = req.body.PRVID ? req.body.PRVID : null;
    if (req.body) _prvNme = req.body.PRVNME ? req.body.PRVNME : null;

    await dbAPls
      .getListOfProvince(_prvId, _prvNme)
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

module.exports.getListOfAmphur = async (req, res) => {
  try {
    if (req.body) _prvId = req.body.PRVID ? req.body.PRVID : null;
    if (req.body) _ampId = req.body.AMPID ? req.body.AMPID : null;
    if (req.body) _ampNme = req.body.AMPNME ? req.body.AMPNME : null;

    await dbAPls
      .getListOfAmphur(_prvId, _ampId, _ampNme)
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

module.exports.getListOfTumbon = async (req, res) => {
  try {
    if (req.body) _prvId = req.body.PRVID ? req.body.PRVID : null;
    if (req.body) _ampId = req.body.AMPID ? req.body.AMPID : null;
    if (req.body) _tmbId = req.body.TMBID ? req.body.TMBID : null;
    if (req.body) _tmbNme = req.body.TMBNME ? req.body.TMBNME : null;

    await dbAPls
      .getListOfTumbon(_prvId, _ampId, _tmbId, _tmbNme)
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
