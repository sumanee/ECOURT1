module.exports = (req, res, next) => {
  // console.log(req.headers.origin);
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-access-token , X-Auth-Token'
  );
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
};
