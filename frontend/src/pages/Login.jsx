import React, { useContext } from 'react'
import Authlayout from '../components/layout/Authlayout'
import Input from '../components/input/input'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vailidatorEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosinstance';
import { API_URLS } from '../utils/apipaths';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);
  const {updateuser} = useContext(UserContext);

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!email || !password){
        setError("All fields are required");
        return;
    }
    if(!vailidatorEmail((email))){
        setError("Enter a valid email");
        return;
    }
    if(!password){
        setError("Please enter your password");
        return;
    }

    try {
      const respones = await axiosInstance.post(API_URLS.AUTH.LOGIN,{
        email, password
      })
      console.log(respones);
      
      const {token,role}= respones.data;
      if(token){
        localStorage.setItem("token", token);
        updateuser(respones.data);
        if(role === "admin"){
          window.location.href = '/admin/dashboard';
      }
      else{
          window.location.href = '/user/dashboard';
      }
      }
    } catch (error) {
      if(error.respones && error.respones.data && error.respones.data.message){
        setError(error.respones.data.message);
    }
      else{
        setError("Something went wrong. Please try again later.");
      }
    }

    setError("");
  }
  return (
    <Authlayout>
        <div className='lg:w-[100%] h-full md:h-full flex flex-col justify-center items-center '>
            <h3 className='text-xl font-semibold text-black'>Welcome back</h3>
            <p className='text-xs font-medium text-slate-700 mt-5 mb-5'>Please inter your detail to login</p>

            <form onSubmit={handleSubmit} >
              <Input
              value={email}
              onChange={({target})=>setEmail(target.value)}
              label="Email Address"
              placehoder="Enter your email"
              type="text"
              />
               <Input
              value={password}
              onChange={({target})=>setPassword(target.value)}
              label="Password"
              placehoder="Enter your password"
              type="password"
              />
              {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}


              <button className='btn-primary'>Login</button>

              

              <p className='text-xs text-slate-700 mt-3'>Don't have an account?
                 <Link to={"/signup"} className='text-blue-600 cursor-pointer underline text-sm'>Sign up</Link>
                 </p>
            </form>
        </div>

    </Authlayout>
  )
}

export default Login