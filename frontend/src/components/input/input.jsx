import React from "react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placehoder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <label className="text-xs  text-slate-700">{label}</label>

      <div className="input-box ">
        <input
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={(e)=>onChange(e)}
          placeholder={placehoder}
          className="w-full outline-none  bg-transparent"
        />
          {
        type === "password" &&(
            <>
            {showPassword ? (
            <FaRegEye
            size={22}
            className="text-slate-400 cursor-pointer"
            />
            ):(
            <FaRegEyeSlash
            size={22}
            onClick={handleTogglePassword}
            className="text-slate-400 cursor-pointer"
            />
            )
        }
            </>
        )
      }
      </div>

    
    </>
  );
};

export default Input;
