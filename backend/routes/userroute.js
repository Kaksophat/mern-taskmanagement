const express = require('express');
const router = express.Router();
const { protect ,adminonly} = require('../middleware/authmiddleware');
const { getusers ,getuserbyid} = require('../controller/usercontroller');   
router.get('/', protect, adminonly, getusers);
router.get("/:id", protect, adminonly, getuserbyid);

module.exports = router;