const express = require("express");
//local imports
const {
  getUserSending,
  getUserWithdraw,
} = require("../controllers/account-detail");
const { verifyToken } = require("../middleware/auth");
const searchMiddleware = require("../middleware/sort-filter-pagination/search");
const WithdrawMoney = require("../models/withdrawMoney");
const sendingMoney = require("../models/sendingMoney");

const router = express.Router();

router.use(verifyToken);

router.get("/sending", searchMiddleware(sendingMoney), getUserSending);
router.get("/withdraw", searchMiddleware(WithdrawMoney), getUserWithdraw);

module.exports = router;
