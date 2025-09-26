import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

const TodolistInput = ({ todolist = [], setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      // make sure todolist is an array
      const safeList = Array.isArray(todolist) ? todolist : [];
      setTodoList([...safeList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    if (!Array.isArray(todolist)) return;
    const updatedArr = todolist.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {Array.isArray(todolist) && todolist.length > 0 ? (
        todolist.map((item, index) => (
          <div
            key={index}
            className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
          >
            <p className="text-xs text-black">
              <span className="text-xs text-gray-400 font-semibold mr-2">
                {index < 9 ? `0${index + 1}` : index + 1}
              </span>
              {typeof item === "string" ? item : JSON.stringify(item)}
            </p>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => handleDeleteOption(index)}
            >
              <HiOutlineTrash className="text-lg text-red-500" />
            </button>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400 mt-2">No TODO items yet</p>
      )}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        <button
          type="button"
          className="card-btn text-nowrap flex items-center gap-1"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodolistInput;
