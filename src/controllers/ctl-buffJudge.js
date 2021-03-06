const { forEachAsync } = require('forEachAsync');
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

const checkData = async (_data, res) => {
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
const updateDataJudge = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .updateJudge(poDataArray)
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
const insterDataJudge = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .insertJudge(poDataArray)
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
const deleteDataByNo = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .deleteJudgeByNo(poDataArray)
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

module.exports.getListJudge = async (req, res) => {
  try {
    await setData(req.body);
    const result = await dbAPls
      .getJudgeByCteId(poDataArray)
      .then(data => {
        let _datarturn;
        if (data.recordset.length > 0) {
          _datarturn = data.recordset.map(_data => {
            if (!_data.JUDFNME) _data.JUDFNME = '';
            if (!_data.JUDLNME) _data.JUDLNME = '';
            if (!_data.TITLEID) _data.TITLEID = 0;
            return _data;
          });
        }
        req.dataJudge = _datarturn;
        return req.dataJudge;
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

module.exports.validateJudge = async (req, res, next) => {
  if (req.body.JUDGELIST && req.body.JUDGELIST.length > 0) {
    let _return = '';
    let _datereturn = '';
    await forEachAsync(req.body.JUDGELIST, async element => {
      if (element.STATUS && element.STATUS === 'D') {
        await deleteDataByNo(element, res);
      } else {
        _datereturn = await checkData(element, res)
          .then(async data => {
            if (data) {
              _return = await updateDataJudge(element, res);
              return _return;
            }
            _return = await insterDataJudge(element, res);
            return _return;
          })
          .catch(err => {});
      }
    });
  }

  next();
};
