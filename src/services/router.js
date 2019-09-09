const express = require('express');
const apisec = require('./api-sec');
const apibuff = require('./api-buff');

const router = new express.Router();
const {
  getCaseMainById,
  getListOfCaseMain,
  searchCaseMain,
  updateCaseMain,
  validateCaseMainCde
} = require('../controllers/ctl-masCaseMain');

const {
  getTitleById,
  getListOfTitle,
  searchTitle,
  updateTitle,
  validateTitleCde
} = require('../controllers/ctl-masTitle');

const {
  getLawyerTypById,
  getListOfLawyerTyp,
  searchLawyerTyp,
  updateLawyerTyp,
  validateLawyerTypCde
} = require('../controllers/ctl-masLawyerTyp');

const {
  getListOfProvince,
  getListOfAmphur,
  getListOfTumbon
} = require('../controllers/ctl-masLocation');

// CaseMain
router.post('/master/getCaseMainById', getCaseMainById);
router.post('/master/getListOfCaseMain', getListOfCaseMain);
router.post('/master/searchCaseMain', searchCaseMain);
router.post('/master/updateCaseMain', updateCaseMain);
router.post('/master/validateCaseMainCde', validateCaseMainCde);

// Title
router.post('/master/getTitleById', getTitleById);
router.post('/master/getListOfTitle', getListOfTitle);
router.post('/master/searchTitle', searchTitle);
router.post('/master/updateTitle', updateTitle);

// LawyerTyp
router.post('/master/getLawyerTypById', getLawyerTypById);
router.post('/master/getListOfLawyerTyp', getListOfLawyerTyp);
router.post('/master/searchLawyerTyp', searchLawyerTyp);
router.post('/master/updateLawyerTyp', updateLawyerTyp);

// Location
router.post('/master/getListOfProvince', getListOfProvince);
router.post('/master/getListOfAmphur', getListOfAmphur);
router.post('/master/getListOfTumbon', getListOfTumbon);

// sec
router.use('/sec', apisec);

// buff
router.use('/buff', apibuff);

module.exports = router;
