import React, { useEffect } from 'react'
import Dashboadlayout from '../../components/layout/Dashboadlayout'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import { API_URLS } from '../../utils/apipaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'

const ManageTask = () => {
  const [alltasks, setalltasks] =useState([])
  
 

  const [tabs, settabs] =useState([])
  console.log("tabs",tabs);
  
  const [filterstatus, setfilterstatus] = useState("All")

  const navigate = useNavigate()

  const getAllTasks = async()=>{
    try {
      const repones = await axiosInstance.get(API_URLS.TASKS.GET_ALL_TASKS,{
        params:{
          status: filterstatus === "All" ? "" : filterstatus
        }
      })
      

      setalltasks(repones.data?.tasks?.length > 0 ? repones.data.tasks : [])
      const statusSummary = repones.data?.statussummary || {}
      const statusArray = [
        {lab:"ALL", count: statusSummary.all || 0},
        {lab:"Pending", count: statusSummary.pendingTasks || 0},
        {lab:"In Progress", count: statusSummary.inProgressTasks || 0},
        {lab:"Completed", count: statusSummary.completedTasks || 0},
      ]
      settabs(statusArray)
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleclick = (taskdata)=>{
   navigate("/admin/create-task",{state:{taskid:taskdata._id}})
  }
  const handledownloadreport =()=>{

  }

  

  useEffect(()=>{
    getAllTasks(filterstatus)
    return ()=>{}
  },[filterstatus])
  
  return (
    <Dashboadlayout  activemanu="Manage Tasks">
      <div className="mt-5">
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>

            <button className='flex lg:hidden download-btn' onClick={handledownloadreport}>
              <LuFileSpreadsheet className='text-lg'/>
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 &&(
            <div className='flex items-center gap-3'>
              <TaskStatusTabs
              tabs={tabs}
              activetab={filterstatus}
              setactivetab={setfilterstatus}
              />
              <button className='hidden lg:flex download-btn' onClick={handledownloadreport}>
                <LuFileSpreadsheet className='text-lg'/>
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {alltasks?.map((items)=>(
            <TaskCard
            key={items._id}
            title={items.title}
            description={items.description}
            status={items.status}
            priority={items.priority}
            duedate={items.duedate}
            progress={items.progress}
            createdAt={items.createdAt}
            assignedTo={items.assignedTo?.map((item)=>item.profileImageUrl)}
            attachmentCount={items.attachments?.length || 0}
            completedTodoCount={items.completedTodoCount || 0}
            todoCheckList={items.todoCheckList}
            onClick={()=> handleclick(items)}
            />

          ))}
        </div>

      </div>
    </Dashboadlayout>
  )
}

export default ManageTask