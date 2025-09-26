import React from 'react'
import { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import Sidemenu from './Sidemenu'

const Navbar = ({activemanu}) => {
    const [open, setopen] = useState(false)
  return (
    <>
     <div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
     <button className='block lg:hidden text-black'
     onClick={()=>setopen(!open)}>
   {
    open ? (
        <HiOutlineX  className='text-2xl'/>
    ):(
     <HiOutlineMenu className="text-2xl"/>
    )
   }
     </button>
        <h2 className='text-lg font-medium text-black'>Task Manager</h2>

        {open && (
            <div className='fixed top-[60px] -ml-4 bg-white'>
                <Sidemenu activemanu={activemanu}/>
            </div>
        )
        
        }

     </div>
    </>
  )
}

export default Navbar