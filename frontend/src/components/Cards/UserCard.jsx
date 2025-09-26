import React from 'react'

const UserCard = ({userinfo}) => {
  return (
    <div className='user-card p-2'>
     <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
           <img 
           src={userinfo?.profileImageUrl || ""}
           className='w-12 h-12 rounded-full border-2 border-white'
           />

           <div>
            <p className='text-sm font-medium'>{userinfo?.name}</p>
            <p className='text-xs text-gray-500'>{userinfo?.email}</p>
           </div>
        </div>
     </div>
     <div className='flex items-center gap-3 mt-5'>
      <StatCard
      label="Pending"
      count={userinfo?.pendingtasks || 0}
      status="pending"
      />
       <StatCard
      label="In Progress"
      count={userinfo?.inprogresstasks || 0}
      status="In Progress"
      />
       <StatCard
      label="Completed"
      count={userinfo?.completedtasks || 0}
      status="Completed"
      />
     </div>
    </div>
  )
}

export default UserCard

const StatCard = ({label,count,status})=>{
    const getStatusColor=()=>{
        switch(status){
            case "In Progress":
                return "text-cyan-500 bg-gray-50"
            case "inprogress":
                return "bg-blue-100 text-blue-600"
            default:
                return "bg-violet-100 bg-gray-50"
        }
    }

    return(
        <div className={`flex-1 text-[10px] font-medium ${getStatusColor()} px-4 py-0.5 rounded`}>
           <span className='text-[12px] font-semibold'>{count}</span> <br /> {label}
        </div>
    )
}