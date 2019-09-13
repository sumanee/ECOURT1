const express = require('express');

const router = new express.Router();

const { validate } = require('../utils/valiData');

const { validateBuff, getDataBuff } = require('../controllers/ctl-buffCase');

const { validateJudge } = require('../controllers/ctl-buffJudge');
const { validateParty } = require('../controllers/ctl-buffParty');
const { validatePlantiff } = require('../controllers/ctl-buffPlantiff');
const { validateLawyer } = require('../controllers/ctl-buffLawyer');
const { validateWitness } = require('../controllers/ctl-buttWitness');

// router.post(
//   '/updateCase',
//   validate('createCaseBuff'),
//   validateBuff,
//   validateJudge,
//   validateParty,
//   validatePlantiff,
//   validateLawyer,
//   getDataBuff
// );

router.post(
  '/updateCase',
  validateBuff,
  // validateJudge,
  // validateParty,
  // validatePlantiff,
  // validateWitness,
  // validateLawyer,
  getDataBuff
);
module.exports = router;
