const { forEachAsync } = require('forEachAsync');
const dbAPls = require('../dbAPls/dao-buffWitness');
const printlog = require('../utils/printLog');

//  WITNO, WITTYP, IDCARDNO, TITLEID, WITFNME, WITLNME, RELATION, OCCUPATION, BIRTHDAY, AGE,
//  NATIONALITY, RACE, ADR_HUSNO, ADR_MOO, ADR_VILLAGE, ADR_ROAD, ADR_ALLEY, ADDRESS, LOCID,
//  POSTCODE, CTEID, CTEDTE 22

let response;
let poDataArray;
function setData(data) {
  poDataArray = {
    WITNO: data.WITNO ? data.WITNO : 0,
    WITTYP: data.WITTYP ? data.WITTYP : 0,
    IDCARDNO: data.IDCARDNO ? data.IDCARDNO : null,
    TITLEID: data.TITLEID ? data.TITLEID : null,
    WITFNME: data.WITFNME ? data.WITFNME : null,
    WITLNME: data.WITLNME ? data.WITLNME : null,

    RELATION: data.RELATION ? data.RELATION : null,
    OCCUPATION: data.OCCUPATION ? data.OCCUPATION : null,
    BIRTHDAY: data.BIRTHDAY ? data.BIRTHDAY : null,
    AGE: data.AGE ? data.AGE : null,
    NATIONALITY: data.NATIONALITY ? data.NATIONALITY : null,
    RACE: data.RACE ? data.RACE : null,
    ADR_HUSNO: data.ADR_HUSNO ? data.ADR_HUSNO : null,
    ADR_MOO: data.ADR_MOO ? data.ADR_MOO : null,
    ADR_VILLAGE: data.ADR_VILLAGE ? data.ADR_VILLAGE : null,

    ADR_ROAD: data.ADR_ROAD ? data.ADR_ROAD : null,
    ADR_ALLEY: data.ADR_ALLEY ? data.ADR_ALLEY : null,
    ADDRESS: data.ADDRESS ? data.ADDRESS : null,
    LOCID: data.LOCID ? data.LOCID : null,
    POSTCODE: data.POSTCODE ? data.POSTCODE : null,
    CTEID: data.CTEID ? data.CTEID : 0
  };
}

const checkData = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .getWitnessByWitnessNo(poDataArray)
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
const updateDataWitness = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .updateWitness(poDataArray)
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
const insterDataWitness = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .insertWitness(poDataArray)
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
      .deleteWitnessByNo(poDataArray)
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

module.exports.getListWitness = async (req, res) => {
  try {
    await setData(req.body);
    const result = await dbAPls
      .getWitnessByCteId(poDataArray)
      .then(data => {
        let _datarturn;
        if (data.recordset.length > 0) {
          _datarturn = data.recordset.map(_data => {
            if (!_data.WITFNME) _data.WITFNME = '';
            if (!_data.WITLNME) _data.WITLNME = '';
            if (!_data.TITLEID) _data.TITLEID = 0;
            return _data;
          });
        }
        req.dataWitness = _datarturn;
        return req.dataWitness;
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

module.exports.validateWitness = async (req, res, next) => {
  if (req.body.WITNESSLIST && req.body.WITNESSLIST.length > 0) {
    let _return = '';
    let _datereturn = '';
    await forEachAsync(req.body.WITNESSLIST, async element => {
      if (element.STATUS && element.STATUS === 'D') {
        await deleteDataByNo(element, res);
      } else {
        _datereturn = await checkData(element, res)
          .then(async data => {
            if (data) {
              _return = await updateDataWitness(element, res);
              return _return;
            }
            _return = await insterDataWitness(element, res);
            return _return;
          })
          .catch(err => {});
      }
    });
  }

  next();
};
