import React, { useEffect, useState } from "react";
import Dashboadlayout from "../../components/layout/Dashboadlayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosinstance";
import { API_URLS } from "../../utils/apipaths";
import toast from "react-hot-toast";
import { Await, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/input/SelectDropdown ";
import SelectUser from "../../components/input/SelectUser";
import TodolistInput from "../../components/input/todolistInput ";
import AttachmentsInput from "../../components/input/AttachmentsInput";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskid } = location.state || {};
  // console.log("todolist",todolist);
  

  const [taskdata, settaskdata] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setcurrentTask] = useState(null);

  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);

  const [openDeleteAlert, setopenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    settaskdata((prevdata) => ({ ...prevdata, [key]: value }));
  };

  const cleardata = () => {
    settaskdata({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };
  const createtask = async () => {
      setloading(true);
    try {
      const todolist = taskdata.todoCheckList?.map((item) => ({ text: item, completed: false }));

      const respones = await axiosInstance.post(API_URLS.TASKS.CREATE_TASK,{
        ...taskdata,
        dueDate: new Date(taskdata.dueDate).toISOString(),
        todoCheckList: todolist
      })

      toast.success("Task created successfully");
      cleardata();
    } catch (error) {
      console.log(error);
      
      setloading(false);
    }

  };

  const gettaskdetailbyid= async()=>{
    try {
      const respones = await axiosInstance.get(API_URLS.TASKS.GET_TASK_BY_ID(taskid))
      console.log("taskid",respones.data);
      
      if(respones.data){
        const taskinfo = respones.data.task
        setcurrentTask(taskinfo)

        settaskdata((prev)=>(
          {
            title: taskinfo.title,
            description: taskinfo.description,
            priority: taskinfo.priority,
            dueDate: taskinfo.dueDate ? moment(taskinfo.dueDate).format("YYYY-MM-DD") : null,
            assignedTo: taskinfo.assignedTo?.map((item)=>item._id) || [],
            todoCheckList:taskinfo.todoCheckList?.map((item)=> item?.text) || [],
            attachments:taskinfo?.attachments || [],
          }
        ))            
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const updatetask = async () => {
    setloading(true);
    try {
      const todolist = taskdata.todoCheckList?.map((item) => {
        const prevtodochecklist = currentTask?.todoCheckList || [];
        const matchtask = prevtodochecklist.find((t) => t.text === item);

        return{
          text: item,
          completed: matchtask ? matchtask.completed : false
        }
      });

      const respones = await axiosInstance.put(API_URLS.TASKS.UPDATE_TASK(taskid),{
        ...taskdata,
        dueDate: new Date(taskdata.dueDate).toISOString(),
        todoCheckList: todolist
      })

      toast.success("Task updated successfully");

    } catch (error) {
      console.log(error);
      setloading(false);
      
    }
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!taskdata.title.trim()) {
      seterror("Task title is required");
      return;
    }
    if (!taskdata.description.trim()) {
      seterror("Task description is required");
      return;
    }
    if (!taskdata.dueDate) {
      seterror("Due date is required");
      return;
    }
    if (taskdata.assignedTo.length === 0) {
      seterror("task not assigned to any member");
      return;
    }
    if (taskdata.todoCheckList.length === 0) {
      seterror("Add atlest one todo item");
      return;
    }

    if (taskid) {
      updatetask();
      return
    }
    createtask();
  };
  const deletetask = async () => {
    try {
      await axiosInstance.delete(API_URLS.TASKS.DELETE_TASK(taskid));
      setopenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate("/admin/tasks")

    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
   if(taskid){
    gettaskdetailbyid(taskid)
   }
    return ()=>{}
  },[taskid])

  return (
    <Dashboadlayout activemanu="create task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskid ? "Update Task" : "Create Task"}
              </h2>
              {taskid && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-300 hover:border-rose-300 cursor-pointer"
                  onClick={() => setopenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" onClick={()=>deletetask()}/> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>

              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskdata.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder=" Descript Task"
                rows={4}
                className="form-input"
                value={taskdata.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskdata.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>

                <input
                  placeholder="Create App UI"
                  className="form-input"
                  value={taskdata.dueDate || ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>

                <SelectUser
                  selectedusers={taskdata.assignedTo}
                  setselectedusers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-600">
                  TODO Checklist
                </label>
                <TodolistInput
                  todolist={taskdata?.todoCheckList}
                  setTodoList={(value) =>
                    handleValueChange("todoCheckList", value)
                  }
                />
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-slate-600">
                  Attachments
                </label>
                <AttachmentsInput
                  attachment={taskdata?.attachments}
                  setAttachments={(value) =>
                    handleValueChange("attachments", value)
                  }
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end mt-2">
                <button
                  className="add-btn"
                  onClick={handlesubmit}
                  disabled={loading}
                >
                  {taskid ? "Update Task" : "Create Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboadlayout>
  );
};

export default CreateTask;
