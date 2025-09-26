const express = require('express');
const router = express.Router();
const { protect, adminonly } = require('../middleware/authmiddleware');
const { exporttaskreport, exportUserReport } = require('../controller/reportcontroller');

router.get("/taskreport", protect, adminonly, exporttaskreport);
router.get("/userreport", protect, adminonly, exportUserReport);
module.exports = router;