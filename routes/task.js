const express = require("express");
//local imports
const { getAllTask, createTask, deleteTask } = require("../controllers/task");
const upload = require("../middleware/file-uploader");
const { checkAdminRole, verifyToken } = require("../middleware/auth");
const searchMiddleware = require("../middleware/sort-filter-pagination/search");
const Task = require("../models/task");

const router = express.Router();

router.use(verifyToken);
router.use(checkAdminRole);

router.get("/", searchMiddleware(Task), getAllTask);
router.post("/", createTask);
router.delete("/:id", deleteTask);

module.exports = router;
