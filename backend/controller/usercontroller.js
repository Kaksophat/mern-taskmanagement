const Task = require('../model/Task');
const User = require('../model/User');
const bcrypt = require('bcryptjs');


const getusers = async (req, res) => {
    try {
        const users = await User.find({role:"member"}).select('-password');

        const userwithtaskcount = await Promise.all(users.map(async (user)=>{
            const inprogresstasks = await Task.countDocuments({assignedTo: user._id, status:"In Progress"});
            const pendingtasks = await Task.countDocuments({assignedTo: user._id, status:"Pending"});
            const completedtasks = await Task.countDocuments({assignedTo: user._id, status:"Completed"});
            return {...user._doc, inprogresstasks, pendingtasks, completedtasks};
        }))
        res.status(200).json(userwithtaskcount);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getuserbyid = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        
    }
}

module.exports = { getusers ,getuserbyid};