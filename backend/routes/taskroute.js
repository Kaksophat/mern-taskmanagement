const express = require('express');
const router = express.Router();
const { protect ,adminonly} = require('../middleware/authmiddleware');

const {
    gettask,
    gettaskbyid,
    createtask,
    updatetask,
    deletetask,
    updatetaskstatus,
    updatetaskchecklist,
    getdashboarddata,
    getuserdashboarddata
} = require('../controller/taskcontroller');

router.get('/dashboard-data', protect, getdashboarddata);
router.get('/user-dashboard-data', protect, getuserdashboarddata);
router.get('/', protect, gettask);
router.get('/:id', protect, gettaskbyid);
router.post('/', protect,adminonly, createtask);
router.put('/:id', protect, updatetask);
router.delete('/:id', protect,adminonly, deletetask);
router.put('/:id/status', protect, updatetaskstatus);
router.put('/:id/todo', protect, updatetaskchecklist);
module.exports = router;