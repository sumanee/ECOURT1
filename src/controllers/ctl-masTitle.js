const dbAPls = require('../dbAPls/dao-masTitle');
const printlog = require('../utils/printLog');

let _id;
let _dsc;
let _sts;
let response;
let _cde;
//
const validateTitle = async (req, res) => {
  try {
    if (req.body) _cde = req.body.TITLECDE ? req.body.TITLECDE : '';

    const result = await dbAPls
      .validateTitle(_cde)
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

const validateTitleCde = async (req, res) => {
  try {
    if (req.body) _id = req.body.TITLEID ? req.body.TITLEID : 0;
    if (req.body) _cde = req.body.TITLECDE ? req.body.TITLECDE : '';
    // console.log("_id :" + _id + " _cde:" + _cde);

    const result = await dbAPls
      .validateTitleCde(_id, _cde)
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

module.exports.getTitleById = async (req, res) => {
  try {
    if (req.body) _id = req.body.TITLEID ? req.body.TITLEID : 0;

    await dbAPls
      .getTitleById(_id)
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

module.exports.getListOfTitle = async (req, res) => {
  try {
    await dbAPls
      .getListOfTitle('E')
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

module.exports.searchTitle = async (req, res) => {
  try {
    if (req.body) _dsc = req.body.TITLEDSC ? req.body.TITLEDSC : null;
    if (req.body) _sts = req.body.STS ? req.body.STS : null;

    await dbAPls
      .searchTitle(_dsc, _sts)
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

module.exports.updateTitle = async (req, res) => {
  try {
    if (req.body) _id = req.body.TITLEID ? req.body.TITLEID : '';
    if (req.body) _dsc = req.body.TITLEDSC ? req.body.TITLEDSC : '';
    if (req.body) _sts = req.body.STS ? req.body.STS : 'E';
    if (req.body) _cde = req.body.TITLECDE ? req.body.TITLECDE : '';

    if (_id !== '') {
      const _chk = await validateTitleCde(req, res);
      if (_chk) {
        await dbAPls
          .updateTitle(_id, _cde, _dsc, _sts)
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
    const _chk = await validateTitle(req, res);

    if (_chk) {
      await dbAPls
        .insertTitle(_cde, _dsc, _sts)
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
