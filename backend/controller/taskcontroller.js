const Task = require("../model/Task");

const gettask = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (req.user.role == "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl "
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl "
      );
    }

    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoCheckList.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedtodoCount: completedCount };
      })
    );

    const alltasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id },
    );

    const pendingtasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const inprogresstasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedtasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    res.status(200).json({
      tasks,
      statussummary: {
        all: alltasks,
        pendingtasks,
        inprogresstasks,
        completedtasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const gettaskbyid = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl role"
    );
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createtask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      attachments,
      todoCheckList,
    } = req.body;
    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
      return res
        .status(400)
        .json({ message: "assignedTo must be a non-empty array" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoCheckList,
    });
    res.status(201).json({ message: "task create successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updatetask = async (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    dueDate,
    assignedTo,
    attachments,
    todoCheckList,
  } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (attachments) task.attachments = attachments;
    if (todoCheckList) task.todoCheckList = todoCheckList;
    if (Array.isArray(assignedTo) && assignedTo.length > 0)
      task.assignedTo = assignedTo;
    await task.save();
    res.status(200).json({ message: "task updated successfully", task });
} catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

const deletetask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    await task.deleteOne();
    res.status(200).json({ message: "task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updatetaskstatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    const isasigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    )
    if(!isasigned && req.user.role !== "admin"){
      return res.status(403).json({ message: "You are not authorized to update the status of this task" });
    }
    task.status = req.body.status || task.status;

    if(task.status === "Completed"){
       task.todoCheckList.forEach((item)=> (item.completed= true))
          task.progress = 100;

     
    }
    await task.save();
    res.status(200).json({ message: "task status updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updatetaskchecklist = async (req, res) => {
  const { todoCheckList } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin"){
      return res.status(403).json({ message: "You are not authorized to update the checklist of this task" });
    }
    task.todoCheckList = todoCheckList;
    const completedCount = task.todoCheckList.filter(
      (item) => item.completed === true
    ).length;
    console.log(completedCount);
    
    const totalitem = task.todoCheckList.length;
    console.log(totalitem);
    
    task.progress = totalitem > 0 ? Math.round((completedCount / totalitem) * 100) : 0;
    if(task.progress === 100){
      task.status = "Completed"
    }else if(task.progress > 0 ){
      task.status = "In Progress"
    }
    else{
      task.status = "Pending"
    }
    await task.save();
    const updatedtask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl role"
    );
    res.status(200).json({ message: "task checklist updated successfully", task: updatedtask });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getdashboarddata = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    console.log(totalTasks);
    
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    const tasksstatus = ["Pending", "In Progress", "Completed"];
    const taskdistributionrow = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskdistribution = tasksstatus.reduce((acc, status) => {
      const formationkey = status.replace(/\s+/g, "");
      acc[formationkey] = 
      taskdistributionrow.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskdistribution["All"] = totalTasks;
    console.log(taskdistribution);
    
    const taskpriorities = ["Low", "Medium", "High"];

    const taskperprioritylevelrow = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskperprioritylevel = taskpriorities.reduce((acc, priority) => {
      acc[priority] =
        taskperprioritylevelrow.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    },{});

    const recenttasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt")

      res.status(200).json({
      statistices:{
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
      charts:{
        taskdistribution,
        taskperprioritylevel
      },
      recenttasks
    });

    
    
    
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getuserdashboarddata = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    const tasksstatus = ["Pending", "In Progress", "Completed"];
    const taskdistributionrow = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskdistribution = tasksstatus.reduce((acc, status) => {
      const formationkey = status.replace(/\s+/g, "");
      acc[formationkey] = 
      taskdistributionrow.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskdistribution["All"] = totalTasks;
    const taskpriorities = ["Low", "Medium", "High"];
    const taskperprioritylevelrow = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskperprioritylevel = taskpriorities.reduce((acc, priority) => {
      acc[priority] =
        taskperprioritylevelrow.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    },{});
    const recenttasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");
    res.status(200).json({
      statistices:{
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
      },
      charts:{
        taskdistribution,
        taskperprioritylevel
      },
      recenttasks
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  gettask,
  gettaskbyid,
  createtask,
  updatetask,
  deletetask,
  updatetaskstatus,
  updatetaskchecklist,
  getdashboarddata,
  getuserdashboarddata,
};
