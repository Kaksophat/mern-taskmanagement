const Task = require("../model/Task");
const User = require("../model/User");
const exelljs = require("exceljs");

const exporttaskreport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new exelljs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tasks_report.xlsx"
    );
    await workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const exportUserReport = async (req, res) => {
    try {
        const users = (await User.find().select("name email _id")).lean();
        const usertask = await Task.find().populate("assignedTo", "name email _id");

        const usertaskmap = {};
        users.forEach((user) => {
            usertaskmap[user._id] ={
                name: user.name,
                email: user.email,
                taskcount: 0,
                inprogressTasks: 0,
                pendingTasks: 0,
                completedTasks: 0
            }
        })

        usertask.forEach((task)=>{
            if(task.assignedTo){
                task.assignedTo.forEach((user)=>{
                    if(usertaskmap[user._id]){
                        usertaskmap[user._id].taskcount +=1;
                        if(task.status === "Pending"){
                            usertaskmap[user._id].pendingTasks +=1;
                        } else if(task.status === "In Progress"){
                            usertaskmap[user._id].inprogressTasks +=1;
                        } else if(task.status === "Completed"){
                            usertaskmap[user._id].completedTasks +=1;
                        }
                    }
                })
            }
        })
        const workbook = new exelljs.Workbook();
        const worksheet = workbook.addWorksheet("Users Report");
        worksheet.columns = [
            {header: "User Name", key: "name", width: 30},
            {header: "Email", key: "email", width: 40},
            {header: "Total Assigned Tasks", key: "taskcount", width: 20},
            {header: "Pending Tasks", key: "pendingTasks", width: 20},
            {header: "In Progress Tasks", key: "inprogressTasks", width: 20},
            {header: "Completed Tasks", key: "completedTasks", width: 18},
        ];

        Object.values(usertaskmap).forEach((user)=>{
            worksheet.addRow(user);
        })

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "users_report.xlsx"
        );
        return workbook.xlsx.write(res).then(()=>{
            res.end();
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
module.exports = { exporttaskreport, exportUserReport };