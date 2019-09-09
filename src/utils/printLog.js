const path = require('path');

const text = {
  result: ``,
  jsfile: '',
  message: ``,
  returndata: ``
};

function baseFileName(_file) {
  return path.basename(_file, '.js');
}

module.exports.writeLog = (_file, _errString) => {
  const txt = `${baseFileName(_file)}, ${_errString}`;
  console.log(txt);
  return txt;
};

function setData(sts, file, txt) {
  text.result = sts;
  text.jsfile = baseFileName(file);
  text.message = txt;
  text.returndata = '';
  // console.log(text);
  return text;
}

module.exports.return_success = _file => {
  return setData('Success', _file, '');
};

module.exports.return_error = (_file, _errString) => {
  return setData('Error', _file, _errString);
};

module.exports.return_waring = (_file, _errString) => {
  return setData('Waring', _file, _errString);
};

module.exports.return_reqBody = (_file, _errString) => {
  return setData('Error', _file, _errString);
};
