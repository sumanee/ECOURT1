const express = require('express');

const router = new express.Router();
const {
  getCaseAll,
  getCaseByCteId,
  updateCase,
  deleteCase
} = require('../controllers/ctl-buffCase');

const {
  updateJudge,
  getJudgeByCaseId,
  deleteJudgeById
} = require('../controllers/ctl-buffJudge');

const {
  updateLawyer,
  getLawyerByCaseId,
  deleteLawyerById
} = require('../controllers/ctl-buffLawyer');

router.post('/getCaseAll', getCaseAll);

router.post('/getCaseByCteId', getCaseByCteId);
router.post('/updateCase', updateCase);
router.post('/deleteCase', deleteCase);

router.post('/updateJudge', updateJudge);
router.post('/getJudgeByCaseId', getJudgeByCaseId);
router.post('/deleteJudgeById', deleteJudgeById);

router.post('/updateLawyer', updateLawyer);
router.post('/getLawyerByCaseId', getLawyerByCaseId);
router.post('/deleteLawyerById', deleteLawyerById);

module.exports = router;
