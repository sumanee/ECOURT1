const dbAPls = require('../dbAPls/dao-secLogAccess');
const printlog = require('../utils/printLog');

let response;
let poDataArray;

function setData(data) {
  // searchLogAccess = all parameter
  // insertSecLogaccess = all parameter
  poDataArray = {
    USRID: data.USRID ? data.USRID : 0,
    ACTION: data.ACTION,
    STRACTIONTIME: data.STRACTIONTIME,
    ENDACTIONTIME: data.ENDACTIONTIME,
    IPADDR: data.IPADDR
  };
}

module.exports.searchLogAccess = async (req, res) => {
  try {
    await setData(req.body);
    await dbAPls
      .searchSecLogaccess(poDataArray)
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
