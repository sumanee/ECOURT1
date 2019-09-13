const { body } = require('express-validator');

exports.validate = method => {
  switch (method) {
    case 'createCaseBuff': {
      return [
        body('CASEDPTID', `CASEDPTID`).optional(),
        body('CASEMAINID', `CASEMAINID`)
          .not()
          .isEmpty(),
        body('BLACKNO', `BLACKNO`)
          .not()
          .isEmpty()
          .isLength({ min: 1, max: 10 }),
        body('REDNO', `REDNO`)
          .not()
          .isEmpty()
          .isLength({ min: 1, max: 10 })
      ];
    }
    case 'createJudgeBuff': {
      return [body('PARTYLIST.*.PRTNO', `userName doesn't exists`).exists()]; // Array
    }
    default: {
      return '';
    }
  }
};
