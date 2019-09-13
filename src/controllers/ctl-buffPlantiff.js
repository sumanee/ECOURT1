const { forEachAsync } = require('forEachAsync');
const dbAPls = require('../dbAPls/dao-buffPlantiff');
const printlog = require('../utils/printLog');

let response;
let poDataArray;
function setData(data) {
  poDataArray = {
    // PLTNO, PLTFNME, PLTLNME, CTEID, CTEDTE
    PLTNO: data.PLTNO ? data.PLTNO : 0,
    PLTFNME: data.PLTFNME ? data.PLTFNME : null,
    PLTLNME: data.PLTLNME ? data.PLTLNME : null,
    TITLEID: data.TITLEID ? data.TITLEID : null,
    CTEID: data.CTEID ? data.CTEID : 0
  };
}

const checkData = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .getPlantiffByPlantiffNo(poDataArray)
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
const updateDataPlantiff = async (_data, res) => {
  try {
    setData(_data);

    const result = await dbAPls
      .updatePlantiff(poDataArray)
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
const insterDataPlantiff = async (_data, res) => {
  try {
    setData(_data);
    const result = await dbAPls
      .insertPlantiff(poDataArray)
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
      .deletePlantiffByNo(poDataArray)
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

module.exports.getListPlantiff = async (req, res) => {
  try {
    await setData(req.body);
    const result = await dbAPls
      .getPlantiffByCteId(poDataArray)
      .then(data => {
        let _datarturn;
        if (data.recordset.length > 0) {
          _datarturn = data.recordset.map(_data => {
            if (!_data.PLTFNME) _data.PLTFNME = '';
            if (!_data.PLTLNME) _data.PLTLNME = '';
            if (!_data.TITLEID) _data.TITLEID = 0;
            return _data;
          });
        }
        req.dataPlantiff = _datarturn;
        return req.dataPlantiff;
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

module.exports.validatePlantiff = async (req, res, next) => {
  if (req.body.PLAINTIFFLIST) {
    let _return = '';
    let _datereturn = '';
    await forEachAsync(req.body.PLAINTIFFLIST, async element => {
      if (element.STATUS && element.STATUS === 'D') {
        await deleteDataByNo(element, res);
      } else {
        _datereturn = await checkData(element, res)
          .then(async data => {
            if (data) {
              _return = await updateDataPlantiff(element, res);
              return _return;
            }
            _return = await insterDataPlantiff(element, res);
            return _return;
          })
          .catch(err => {});
      }
    });
  }

  next();
};
