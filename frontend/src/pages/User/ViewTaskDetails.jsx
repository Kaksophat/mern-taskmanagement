import React, { useState } from 'react'
import { useEffect } from 'react'
import axiosInstance from '../../utils/axiosinstance'
import { API_URLS } from '../../utils/apipaths'
import Dashboadlayout from '../../components/layout/Dashboadlayout'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { LuSquareArrowOutUpRight } from 'react-icons/lu'
import AvatarGroup from '../../components/layout/AvatarGroup'

const ViewTaskDetails = () => {
  const {id} = useParams()
  const [task,settask] = useState(null)

  const getstatustagcolor = (status)=>{
    switch (status) {
     
      case "In Progress":
        return "bg-cyan-500 bg-cyan-500 border border-cyan-500/10"
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10"
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10"
    }
  }

  const getTaskDetailsbyid = async()=>{
    try {
      const repones = await axiosInstance.get(API_URLS.TASKS.GET_TASK_BY_ID(id))
      if(repones.data){
        settask(repones.data.task)
      }
      console.log(repones.data);
      
    } catch (error) {
      console.log(error);
      
    }

  }

  const updatetodochecklist=async(index)=>{
    const todoCheckList = [...task.todoCheckList];
    const taskid = id
    if(todoCheckList && todoCheckList[index]){
      todoCheckList[index].completed = !todoCheckList[index].completed
    }
    try {
      const respones = await axiosInstance.put(API_URLS.TASKS.UPDATE_TODO_CHECKLIST(taskid),{
        todoCheckList
      })
      if(respones.status === 200){
        settask(respones.data.task)
      }
      else{
        todoCheckList[index].completed = !todoCheckList[index].completed
      }
    } catch (error) {
      todoCheckList[index].completed = !todoCheckList[index].completed
      console.log(error);
      
    }

  }
  const handlelinkclick=(url)=>{
    if(!/^https?:\/\//i.test(url)){
      url = "http://" + url;
    }
    window.open(url, '_blank');
  }

  useEffect(()=>{
    if(id){
      getTaskDetailsbyid()
    }
    return ()=>{}
  },[])
  return (
   <Dashboadlayout activemanu="My Tasks">
  <div className='mt-5'>
     {task &&( <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
      <div className='form-card col-span-3 '>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>
            {task?.title}
          </h2>

          <div
          className={`text-[13px] font-medium ${getstatustagcolor(task?.status)} px-3 py-1 rounded-full `}

          >
            {task?.status}
          </div>

        </div>
        <div className='mt-4'>
          <InfoBox label="description" value={task?.description}/>

        </div>
        <div className='grid grid-cols-12 gap-4 mt-4'>
          <div className="col-span-12 md:col-span-4">
            <InfoBox label="Priority" value={task?.priority}/>
          </div>
          <div className='col-span-12'>
            <InfoBox label="Due Date" value={task?.dueDate ? moment(task?.dueDate).format("DD MMM YYYY") : "NA" }/>
          </div>
          <div className='col-span-12 md:col-span-4'>
            <label className='text-xs font-medium text-slate-500'>
              Assigned To
            </label>

            <AvatarGroup 
            avatars={task?.assignedTo?.map((item)=>item?.profileImageUrl) || []}
            maxVisible={5}
            />
          </div>

        </div>

        <div className='mt-2'>
          <label className='text-xs font-medium text-slate-500'>
            Todo CheckList
          </label>
          {task?.todoCheckList?.map((item,index)=>(
           <TodoCheckList
           key={`todo-${index}`}
           text={item?.text}
           ischecked={item?.completed}
           onchange={()=>updatetodochecklist(index)}
           />

          ))}

        </div>

       {task?.attachments?.length > 0 && (
        <div className='mt-4'>
          <label className='text-xs font-medium text-slate-500'>
            Attachments
          </label>
          {task?.attachments?.map((link,index)=>(
            <Attachments
            key={`attchment-${index}`}
            link={link}
            onClick={()=>handlelinkclick(link)}
            index={index}
            />
          ))}
          </div>
       )}
      </div>

     </div> )}
    
  </div>
   </Dashboadlayout>
  )
}

export default ViewTaskDetails

const InfoBox=({label, value})=>{
  return<>
   <label className='text-xs font-medium text-slate-500'>{label}</label>
    <p className='text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5'>{value}</p>
  </>
}
const TodoCheckList=({text,ischecked, onchange})=>{
  return <div className='flex items-center gap-2 p-3'>
    <input type="checkbox" 
    checked={ischecked}
    onChange={onchange}
    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm outline-none'
    />
    <p className='text-[13px] text-gray-800'>{text}</p>

  </div>
}
const Attachments=({link,onClick,index})=>{
  return <div className='flex justify-between bg-gray-50 border border-gray-100 rounded-md px-3 py-2 mt-3 mb-2 cursor-pointer'
  onClick={onClick}>
    <div className='flex-1 flex items-center gap-2 border border-gray-100'>

      <span className='text-xs text-gray-400 font-semibold mr-2 '>
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className='text-xs text-black'>{link}</p>
    </div>
    <LuSquareArrowOutUpRight className='text-gray-400'/>
  
  </div>
}