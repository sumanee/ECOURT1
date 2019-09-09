const express = require('express');

const router = new express.Router();
const { searchLogAccess } = require('../controllers/ctl-secLogAccess');
const {
  getListOfUserAssign,
  updateUserAssign,
  searchUserAssign,
  validateUserAssignCde,
  getUserAssignById
} = require('../controllers/ctl-secUserAssign');

router.post('/searchLogAccess', searchLogAccess);

router.post('/getListOfUserAssign', getListOfUserAssign);
router.post('/updateUserAssign', updateUserAssign);
router.post('/validateUserAssignCde', validateUserAssignCde);
router.post('/getUserAssignById', getUserAssignById);
router.post('/searchUserAssign', searchUserAssign);

module.exports = router;
