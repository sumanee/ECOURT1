const dbAPls = require('../dbAPls/dao-secUserAssign');
const printlog = require('../utils/printLog');

let response;
let poDataArray;

function setData(data) {
  // getListOfUserAssign = STS
  // searchUserAssign = (ASSIGNCDE, ASSIGNDSC, STS)
  // updateUserAssign = all parameter
  // validateUserAssignCde = (ASSIGNCDE, ASSIGNID)
  // getUserAssignById = ASSIGNID
  poDataArray = {
    ASSIGNID: data.ASSIGNID ? data.ASSIGNID : 0,
    ASSIGNCDE: data.ASSIGNCDE,
    ASSIGNDSC: data.ASSIGNDSC,
    STS: data.STS ? data.STS : 'E',
    CTEID: data.CTEID ? data.CTEID : 0
  };
}

module.exports.getListOfUserAssign = async (req, res) => {
  // console.log('getListOfUserAssign');
  try {
    setData(req.body);

    await dbAPls
      .getListOfUserAssign(poDataArray)
      .then(data => {
        if (data.recordset) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_error(__filename);
          res.status(500);
        }
      })
      .catch(err => {
        response = printlog.return_error(__filename, err.toString());
        res.status(500);
      });
    return res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.getUserAssignById = async (req, res) => {
  // console.log('getUserAssignById');
  try {
    setData(req.body);

    await dbAPls
      .getUserAssignById(poDataArray)
      .then(data => {
        if (data.recordset) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_error(__filename);
          res.status(500);
        }
      })
      .catch(err => {
        response = printlog.return_error(__filename, err.toString());
        res.status(500);
      });
    return res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.searchUserAssign = async (req, res) => {
  // console.log('getListOfUserAssign');
  try {
    setData(req.body);

    await dbAPls
      .searchUserAssign(poDataArray)
      .then(data => {
        if (data.recordset) {
          response = printlog.return_success(__filename);
          response.returndata = data.recordset;
          res.status(200);
        } else {
          response = printlog.return_error(__filename);
          res.status(500);
        }
      })
      .catch(err => {
        response = printlog.return_error(__filename, err.toString());
        res.status(500);
      });
    return res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

const validate = async (req, res) => {
  // console.log('validate');
  try {
    const result = await dbAPls
      .validateUserAssign(poDataArray)
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

module.exports.updateUserAssign = async (req, res) => {
  // console.log('updateUserAssign');
  try {
    await setData(req.body);

    if (poDataArray.assignid !== 0) {
      await dbAPls
        .updateUserAssign(poDataArray)
        .then(data => {
          if (data.rowsAffected[0] === 1) {
            response = printlog.return_success(__filename);
            response.returndata = data.recordset;
            res.status(200);
          } else {
            response = printlog.return_error(__filename);
            res.status(500);
          }
        })
        .catch(err => {
          response = printlog.return_error(__filename, err.toString());
          res.status(500);
        });
    }

    if (!(await validate(req, res))) {
      response = printlog.return_waring(__filename, `Duplicate data of code.`);
      res.status(200);
    } else if (await validate(req, res)) {
      await dbAPls
        .insertUserAssign(poDataArray)
        .then(data => {
          if (data.rowsAffected[0] === 1) {
            response = printlog.return_success(__filename);
            response.returndata = data.recordset;
            res.status(200);
          } else {
            response = printlog.return_error(__filename);
            res.status(500);
          }
        })
        .catch(err => {
          response = printlog.return_error(__filename, err.toString());
          res.status(500);
        });
    }

    return res.send({ response });
  } catch (err) {
    res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};

module.exports.validateUserAssignCde = async (req, res) => {
  try {
    await setData(req.body);

    await dbAPls
      .validateUserAssignCde(poDataArray)
      .then(data => {
        if (data.rowsAffected[0] === 0) {
          response = printlog.return_waring(
            __filename,
            `Duplicate data of code.`
          );
          res.status(200);
        } else {
          response = printlog.return_waring(__filename, 'Can use this code.');
          res.status(200);
        }
      })
      .catch(err => {
        response = printlog.return_error(__filename, err.toString());
        res.status(500);
      });
    return res.send(response);
  } catch (err) {
    return res.status(500).send({
      response: printlog.return_error(__filename, err.toString())
    });
  }
};
