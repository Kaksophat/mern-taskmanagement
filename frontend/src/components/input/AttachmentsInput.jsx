import React, { useState } from 'react'
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

const AttachmentsInput = ({ attachment, setAttachments}) => {
    const [option, setOption] = useState("")
    const handleAddOption=()=>{
        if(option.trim()){
            setAttachments([...attachment, option.trim()]);
            setOption("")
        }
    }
    const handleDeleteOption=(index)=>{
        const updatedArr=attachment.filter((_,idx)=>idx!==index);
        setAttachments(updatedArr)
    }
  return (
     <div>
          {attachment.map((item, index) => (
            <div
              key={index} 
              className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
            >
             <div className='flex-1 flex items-center gap-3 border border-gray-100'>
                <LuPaperclip className="text-gray-300"/>
                <p className="text-xs text-black"> {item} </p>
             </div>
              <button
                className="cursor-pointer"
                onClick={() => handleDeleteOption(index)}
              >
                <HiOutlineTrash className="text-lg text-red-500" />
              </button>
            </div>
          ))}
    
          <div className="flex items-center gap-5 mt-4">
            <input
              type="text"
              placeholder="Add file link"
              value={option}
              onChange={({ target }) => setOption(target.value)}
              className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
            />   
            <button
              className="card-btn text-nowrap flex items-center gap-1"
              onClick={handleAddOption}
            >
              <HiMiniPlus className="text-lg" /> Add
            </button>
          </div>
        </div>
  )
}

export default AttachmentsInput