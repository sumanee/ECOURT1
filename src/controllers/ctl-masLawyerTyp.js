const dbAPls = require('../dbAPls/dao-masLawyerTyp');
const printlog = require('../utils/printLog');

let _id;
let _dsc;
let _sts;
let response;
let _cde;

const validateLawyerTyp = async (req, res) => {
  try {
    if (req.body) _cde = req.body.LAWTYPCDE ? req.body.LAWTYPCDE : '';

    const result = await dbAPls
      .validateLawyerTyp(_cde)
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

const validateLawyerTypCde = async (req, res) => {
  try {
    if (req.body) _id = req.body.LAWTYPID ? req.body.LAWTYPID : 0;
    if (req.body) _cde = req.body.LAWTYPCDE ? req.body.LAWTYPCDE : '';
    // console.log("_id :" + _id + " _cde:" + _cde);
    //

    const result = await dbAPls
      .validateLawyerTypCde(_id, _cde)
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

module.exports.getLawyerTypById = async (req, res) => {
  try {
    if (req.body) _id = req.body.LAWTYPID ? req.body.LAWTYPID : 0;

    await dbAPls
      .getLawyerTypById(_id)
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

module.exports.getListOfLawyerTyp = async (req, res) => {
  try {
    await dbAPls
      .getListOfLawyerTyp('E')
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

module.exports.searchLawyerTyp = async (req, res) => {
  try {
    if (req.body) _dsc = req.body.LAWTYPDSC ? req.body.LAWTYPDSC : null;
    if (req.body) _sts = req.body.STS ? req.body.STS : null;

    await dbAPls
      .searchLawyerTyp(_dsc, _sts)
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

module.exports.updateLawyerTyp = async (req, res) => {
  try {
    if (req.body) _id = req.body.LAWTYPID ? req.body.LAWTYPID : '';
    if (req.body) _dsc = req.body.LAWTYPDSC ? req.body.LAWTYPDSC : '';
    if (req.body) _sts = req.body.STS ? req.body.STS : 'E';
    if (req.body) _cde = req.body.LAWTYPCDE ? req.body.LAWTYPCDE : '';

    if (_id !== '') {
      const _chk = await validateLawyerTypCde(req, res);
      if (_chk) {
        await dbAPls
          .updateLawyerTyp(_id, _cde, _dsc, _sts)
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
    }

    const _chk = await validateLawyerTyp(req, res);
    if (_chk) {
      await dbAPls
        .insertLawyerTyp(_cde, _dsc, _sts)
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
