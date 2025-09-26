import React, { useEffect, useState } from 'react'
import Dashboadlayout from '../../components/layout/Dashboadlayout'
import axiosInstance from '../../utils/axiosinstance'
import { API_URLS } from '../../utils/apipaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import UserCard from '../../components/Cards/UserCard'

const ManageUser = () => {
  const [allusers, setallusers] = useState([])

  const getallusers = async()=>{
    try {
      const respones = await axiosInstance.get(API_URLS.USERS.GET_ALL_USERS)
      if(respones.data?.length > 0){
        setallusers(respones.data)

      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const handledownloadreport=()=>{
    try {
      const repones = axiosInstance.get(API_URLS.REPORTS.EXPORT_USERS,{
        responseType:"blob"
      })
      const url = window.URL.createObjectURL(new Blob([repones.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download','userreport.xlsx')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error);
      
    }

  }

  useEffect(()=>{
    getallusers()
    return ()=>{}
  },[])
  return (
    <Dashboadlayout activemanu="Team Members">
      <div className='mt-5 mb-10'>
        <div className='flex md:flex-row md:items-center justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>Team Members</h2>
          
          <button className='flex md:flex download-btn' onClick={handledownloadreport}>
            <LuFileSpreadsheet className='text-lg'/>
            Download Report
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allusers.map((user)=>(
            <UserCard key={user._id} userinfo={user}/>
          ))}
        </div>
      </div>
      </Dashboadlayout>
  )
}

export default ManageUser