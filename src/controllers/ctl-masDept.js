const dbAPls = require('../dbAPls/dao-masDept');
const printlog = require('../utils/printLog');

let _id;
let _name;
let response;
let _cde;

module.exports.getDeptById = async (req, res) => {
  try {
    if (req.body) _id = req.body.DPTID ? req.body.DPTID : '';

    await dbAPls
      .getDeptById(_id)
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

module.exports.getDeptByCde = async (req, res) => {
  try {
    if (req.body) _cde = req.body.DPTCDE ? req.body.DPTCDE : '';

    await dbAPls
      .getDeptByCde(_cde)
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

module.exports.getListOfDept = async (req, res) => {
  try {
    await dbAPls
      .getListOfDept('E')
      .then(data => {
        console.log('data', data);

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

module.exports.searchDept = async (req, res) => {
  try {
    if (req.body) _id = req.body.DPTID ? req.body.DPTID : null;
    if (req.body) _name = req.body.DPTNME ? req.body.DPTNME : null;

    await dbAPls
      .searchDept(_id, _name)
      .then(data => {
        if (data.recordset > 0) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_waring(__filename);
          res.status(200);
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
