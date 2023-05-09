const express = require("express");
//local imports
const {
  getUserSending,
  getUserWithdraw,
} = require("../controllers/account-detail");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.get("/sending",  getUserSending);
router.get("/withdraw",  getUserWithdraw);

module.exports = router;
