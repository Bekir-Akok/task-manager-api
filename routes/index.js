const express = require("express");

//local imports
const auth = require("./auth");
const profile = require("./profile");
const charge = require("./charge");
const task = require("./task");
const userManagement = require("./user-management");
const withdraw = require("./withdraw");
const userTask = require("./user-task");
const accountDetail = require("./account-detail");
const picture = require("./picture-management");

const router = express.Router();

router.use("/auth", auth);
router.use("/profile", profile);
router.use("/charge", charge);
router.use("/task", task);
router.use("/user-management", userManagement);
router.use("/withdraw", withdraw);
router.use("/user-task", userTask);
router.use("/account-detail", accountDetail);
router.use("/picture", picture);

module.exports = router;
