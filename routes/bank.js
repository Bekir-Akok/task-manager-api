const express = require("express");
//local imports
const {
  getActiveBank,
  getAllBank,
  createBankAccount,
  changeAccountStatus,
} = require("../controllers/bank");
const Bank = require("../models/bank");
const { verifyToken, checkAdminRole } = require("../middleware/auth");
const searchMiddleware = require("../middleware/sort-filter-pagination/search");

const router = express.Router();

router.use(verifyToken);

router.get("/active", getActiveBank);
router.get("/", checkAdminRole, searchMiddleware(Bank), getAllBank);
router.post("/", checkAdminRole, createBankAccount);
router.put("/:id", checkAdminRole, changeAccountStatus);

module.exports = router;
