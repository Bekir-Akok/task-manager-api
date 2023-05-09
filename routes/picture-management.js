const express = require("express");
//local imports
const {
  photoGet,
  photoCreate,
  photoUpdate,
} = require("../controllers/photo-management");
const { checkAdminRole, verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.get("/", photoGet);
router.post("/", checkAdminRole, photoCreate);
router.put("/:id", checkAdminRole, photoUpdate);

module.exports = router;
