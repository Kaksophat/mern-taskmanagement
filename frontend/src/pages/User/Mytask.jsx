import React, { useEffect } from 'react'
import Dashboadlayout from '../../components/layout/Dashboadlayout'
import { useState } from 'react'
import { useNavigate ,useLocation} from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import { API_URLS } from '../../utils/apipaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'
import moment from 'moment'

const Mytask = () => {
  const [alltasks, setalltasks] =useState([])
  
  
 

  const [tabs, settabs] =useState([])
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
        {lab:"Pending", count: statusSummary.pendingtasks || 0},
        {lab:"In Progress", count: statusSummary.inProgresstasks || 0},
        {lab:"Completed", count: statusSummary.completedtasks || 0},
      ]
      console.log(repones.data);
      
      settabs(statusArray)
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleclick = (taskid)=>{
   navigate(`/user/task-details/${taskid}`)
  }
 
  

  useEffect(()=>{
    getAllTasks(filterstatus)
    return ()=>{}
  },[filterstatus])
  
  return (
    <Dashboadlayout  activemanu="My Tasks">
      <div className="mt-5">
        <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
            <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>

          

          {tabs?.[0]?.count > 0 &&(
              <TaskStatusTabs
              tabs={tabs}
              activetab={filterstatus}
              setactivetab={setfilterstatus}
              />
           
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {alltasks?.map((items,index)=>(
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
            onClick={()=> handleclick(items._id)}
            />

          ))}
        </div>

      </div>
    </Dashboadlayout>
  )
}

export default Mytask