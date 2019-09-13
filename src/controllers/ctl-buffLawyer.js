const { forEachAsync } = require('forEachAsync');
const dbAPls = require('../dbAPls/dao-buffLawyer');
const printlog = require('../utils/printLog');

let response;
let poDataArray;
function setData(data) {
  poDataArray = {
    // LAWNO, LAWTYPID, LAWFNME, LAWLNME, TITLEID, CTEID
    LAWNO: data.LAWNO ? data.LAWNO : 0,
    LAWTYPID: data.LAWTYPID ? data.LAWTYPID : 0,
    LAWFNME: data.LAWFNME ? data.LAWFNME : null,
    LAWLNME: data.LAWLNME ? data.LAWLNME : null,
    TITLEID: data.TITLEID ? data.TITLEID : null,
    CTEID: data.CTEID ? data.CTEID : 0
  };
}

const checkData = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .getLawByLawNo(poDataArray)
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
const updateDataLawyer = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .updateLawyer(poDataArray)
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
const insterDataLawyer = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .insertLawyer(poDataArray)
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
const deleteLawyerByNo = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .deleteLawyerByNo(poDataArray)
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

module.exports.getListLawyer = async (req, res) => {
  try {
    await setData(req.body);
    const result = await dbAPls
      .getLawByCteId(poDataArray)
      .then(data => {
        let _datarturn;
        if (data.recordset.length > 0) {
          _datarturn = data.recordset.map(_data => {
            if (!_data.LAWFNME) _data.LAWFNME = '';
            if (!_data.LAWLNME) _data.LAWLNME = '';
            if (!_data.TITLEID) _data.TITLEID = 0;
            return _data;
          });
        }
        req.dataLawyer = _datarturn;
        return req.dataLawyer;
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

module.exports.validateLawyer = async (req, res, next) => {
  if (req.body.LAWYERLIST) {
    let _return = '';
    let _datereturn = '';
    await forEachAsync(req.body.LAWYERLIST, async element => {
      if (element.STATUS && element.STATUS === 'D') {
        await deleteLawyerByNo(element, res);
      } else {
        _datereturn = await checkData(element, res)
          .then(async data => {
            if (data) {
              _return = await updateDataLawyer(element, res);
              return _return;
            }
            _return = await insterDataLawyer(element, res);
            return _return;
          })
          .catch(err => {});
      }
    });
  }

  next();
};
