import React from 'react'

const TaskStatusTabs = ({tabs, activetab,  setactivetab}) => {
  return (
    <div className='my-2'>
       <div className='flex'>
        {tabs.map((tab)=>(
          <button
          key={tab.lab}
          className={`relative px-3 md:px-4 text-sm font-medium ${
            activetab === tab.lab ? "text-blue-500" : "text-gray-500"
          } cursor-pointer`}
          onClick={()=> setactivetab(tab.lab)}
          >
            <div className='flex items-center'>
                <span className='text-xs'>{tab.lab}</span>
                <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                    activetab === tab.lab ? "bg-blue-100 text-blue-600" : "bg-gray-200/70 text-gray-600"
                }`}>
                    {tab.count }
                </span>
            </div>
            {activetab === tab.lab && (
                <div className='absolute bottom-0 left-0 w-full h-0.5 bg-blue-700'></div>
            )}

          </button>
        ))}
       </div>
    </div>
  )
}

export default TaskStatusTabs