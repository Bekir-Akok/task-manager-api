const express = require("express");
//local imports
const {
  getUserTasks,
  approvedTask,
  getApprovedTask,
  createDoneTask,
  getDoneTask,
} = require("../controllers/user-task");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.get("/", getUserTasks);
router.put("/take/:taskId/:index", approvedTask);
router.get("/approved", getApprovedTask);
router.get("/done", getDoneTask);
router.post("/approved/:taskId/:index", createDoneTask);

module.exports = router;
