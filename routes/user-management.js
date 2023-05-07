const express = require("express");
//local imports
const {
  getAllUser,
  updateTaskFromUser,
  deleteTaskFromUser,
  createModeratorUser,
  getAllTaskByUser,
} = require("../controllers/user-management");
const User = require("../models/user");
const searchMiddleware = require("../middleware/sort-filter-pagination/search");
const { checkAdminRole, verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);
router.use(checkAdminRole);

router.get("/:id", getAllTaskByUser);
router.get("/", searchMiddleware(User), getAllUser);
router.put("/:id/:taskId", updateTaskFromUser);
router.delete("/:id/:taskId/:index", deleteTaskFromUser);
router.post("/", createModeratorUser);

module.exports = router;
