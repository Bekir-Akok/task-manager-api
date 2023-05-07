const express = require("express");

//local imports
const SendingMoney = require("../models/sendingMoney");
const {
  userSend,
  checkAdminUserSend,
  userSendingUpdate,
} = require("../controllers/charge");
const { checkAdminRole, verifyToken } = require("../middleware/auth");
const searchMiddleware = require("../middleware/sort-filter-pagination/search");

const router = express.Router();

router.use(verifyToken);

router.post("/", userSend);
router.get(
  "/admin",
  checkAdminRole,
  searchMiddleware(SendingMoney),
  checkAdminUserSend
);
router.put("/admin/:id", checkAdminRole, userSendingUpdate);

module.exports = router;
