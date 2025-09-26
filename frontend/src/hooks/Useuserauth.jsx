import { useContext ,useEffect} from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom";

export const UseUserAuth = () => {
const {user,loading,clearuser}=useContext(UserContext)
const navigate=useNavigate();
useEffect(()=>{
    if(loading) return;
    if(user) return;
    if(!user){
        clearuser();
        navigate("/login");

    }
},[user,loading,navigate,clearuser])
}