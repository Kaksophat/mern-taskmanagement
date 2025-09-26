import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import Navbar from './Navbar'
import Sidemenu from './Sidemenu'

const Dashboadlayout = ({children,activemanu}) => {
    const {user} = useContext(UserContext)
  return (
    <>
    <div className=''>
      <Navbar activemanu={activemanu}/>
      {user &&
      (
        <div className='flex'>
            <div className='max-[1080px]:hidden'>
                <Sidemenu activemanu={activemanu}/>
            </div>
            <div className='grow  mx-5'>{children}</div>
        </div>
      )
      }
    </div>
    </>
  )
}

export default Dashboadlayout