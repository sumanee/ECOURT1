const { forEachAsync } = require('forEachAsync');
const dbAPls = require('../dbAPls/dao-buffParty');
const printlog = require('../utils/printLog');

let response;
let poDataArray;
function setData(data) {
  poDataArray = {
    // PRTNO, TITLEID, IDCARDNO, PRTFNME, PRTLNME, ADR_HUSNO, ADR_MOO, ADR_VILLAGE,
    // ADR_ROAD, ADR_ALLEY, LOCID, POSTCODE, COJCTL, ADR_TMBNME, ADR_AMPNME, ADR_PRVNME, CTEID, CTEDTE
    PRTNO: data.PRTNO ? data.PRTNO : 0,
    PRTFNME: data.PRTFNME ? data.PRTFNME : null,
    PRTLNME: data.PRTLNME ? data.PRTLNME : null,
    TITLEID: data.TITLEID ? data.TITLEID : null,
    CTEID: data.CTEID ? data.CTEID : 0
  };
}

const checkData = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .getPartyByPartyNo(poDataArray)
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
const updateDataParty = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .updateParty(poDataArray)
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
const insterDataParty = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .insertParty(poDataArray)
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
const deletePartyByNo = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .deletePartyByNo(poDataArray)
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

module.exports.getListParty = async (req, res) => {
  try {
    await setData(req.body);
    const result = await dbAPls
      .getPartyByCteId(poDataArray)
      .then(data => {
        let _datarturn;
        if (data.recordset.length > 0) {
          _datarturn = data.recordset.map(_data => {
            if (!_data.PRTFNME) _data.PRTFNME = '';
            if (!_data.PRTLNME) _data.PRTLNME = '';
            if (!_data.TITLEID) _data.TITLEID = 0;
            return _data;
          });
        }
        req.dataParty = _datarturn;
        return req.dataParty;
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

module.exports.validateParty = async (req, res, next) => {
  if (req.body.PARTYLIST) {
    let _return = '';
    let _datereturn = '';
    await forEachAsync(req.body.PARTYLIST, async element => {
      if (element.STATUS && element.STATUS === 'D') {
        await deletePartyByNo(element, res);
      } else {
        _datereturn = await checkData(element, res)
          .then(async data => {
            if (data) {
              _return = await updateDataParty(element, res);
              return _return;
            }
            _return = await insterDataParty(element, res);
            return _return;
          })
          .catch(err => {});
      }
      // nextArray();
    });
  }
  console.log('a');

  next();
};
