const express = require("express");
//local imports
const {
  resetPassword,
  walletDetail,
  getWalletDetail,
  changeSecurityCode,
  getQuestData,
  getBalanceData,
} = require("../controllers/profile");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

//all profile infos get
router.get("/", getQuestData);
router.get("/balance", getBalanceData);
router.post("/reset-password", resetPassword);
router.get("/account", getWalletDetail);
router.post("/account", walletDetail);
router.put("/security-code", changeSecurityCode);

module.exports = router;
