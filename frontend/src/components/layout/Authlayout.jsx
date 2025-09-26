import React from 'react'

const Authlayout = ({children}) => {
  return (
    <div className='min-h-screen h-screen '>
        <h1 className='text-lg font-medium text-black text-center pt-10'>Task Management</h1>
        {children}

    </div>
  )
}

export default Authlayout