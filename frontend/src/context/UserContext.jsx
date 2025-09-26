import axiosInstance from "../utils/axiosinstance";
import { API_URLS } from "../utils/apipaths";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({children})=>{
    const [user,setuser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        if(user) return;
        const accesstoken = localStorage.getItem("token");
        if(!accesstoken){
            setLoading(false);
            return;
        }
        const fetchUser = async()=>{
            try {
                const response = await axiosInstance.get(API_URLS.AUTH.GET_PROFILE);
                setuser(response.data);
            } catch (error) {
                console.log("Error fetching user data", error);
                clearuser();
            }
            setLoading(false);
        }
        fetchUser();

    },[])
    const clearuser = ()=>{
        localStorage.removeItem("token");
        setuser(null);
    }
    const updateuser=(userdata)=>{
        setuser(userdata);
        localStorage.setItem("token", userdata.token);  
        setLoading(false);
    }
    return <UserContext.Provider value={{user, loading, clearuser, updateuser}}>
        {children}
    </UserContext.Provider>
}

export default UserProvider;