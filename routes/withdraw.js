const express = require("express");

//local imports
const WithdrawMoney = require("../models/withdrawMoney");
const {
  userWithdraw,
  checkAdminUserWithdraw,
  userWithdrawUpdate,
} = require("../controllers/withdraw");
const { checkAdminRole, verifyToken } = require("../middleware/auth");
const searchMiddleware = require("../middleware/sort-filter-pagination/search");

const router = express.Router();

router.use(verifyToken);

router.post("/", userWithdraw);
router.get(
  "/admin",
  checkAdminRole,
  searchMiddleware(WithdrawMoney),
  checkAdminUserWithdraw
);
router.put("/admin/:id", checkAdminRole, userWithdrawUpdate);

module.exports = router;
