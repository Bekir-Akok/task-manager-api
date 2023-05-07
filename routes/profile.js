const express = require("express");
//local imports
const {
  resetPassword,
  walletDetail,
  getWalletDetail,
  changeSecurityCode,
} = require("../controllers/profile");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.post("/reset-password", resetPassword);
router.get("/account", getWalletDetail);
router.post("/account", walletDetail);
router.put("/security-code", changeSecurityCode);

module.exports = router;
