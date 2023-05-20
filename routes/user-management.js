const express = require("express");
//local imports
const {
  getAllUser,
  updateTaskFromUser,
  deleteTaskFromUser,
  createModeratorUser,
  getAllTaskByUser,
  userInfoUpdate,
  userChangePassword,
} = require("../controllers/user-management");
const User = require("../models/user");
const searchMiddleware = require("../middleware/sort-filter-pagination/search");
const { checkAdminRole, verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);
router.use(checkAdminRole);

router.get("/:id", getAllTaskByUser);
router.get("/", searchMiddleware(User), getAllUser);
router.put("/update/:id/:taskId", updateTaskFromUser);
router.delete("/:id/:taskId/:index", deleteTaskFromUser);
router.post("/", createModeratorUser);
router.put("/account/:id", userInfoUpdate);
router.put("/password/:id", userChangePassword);

module.exports = router;
