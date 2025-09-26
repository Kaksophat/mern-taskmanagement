import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const Profilepic = ({ image, setimage }) => {
  const inputref = useRef(null);
  const [preview, setpreview] = useState(null);

  const handleimagechange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimage(file);

      const preview = URL.createObjectURL(file);
      setpreview(preview);
    }
  };

  const removeimage = () => {
    setimage("");
    setpreview(null);
  };

  const onchoosefile = () => {
    inputref.current.click();
  };
  return (
    <>
      <div className="flex justify-center ms-[250px] mb-3">
        <input
          type="file"
          accept="image/*"
          ref={inputref}
          onChange={handleimagechange}
          className="hidden"
        />
        {!image ? (
          <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
            <LuUser className="text-3xl text-blue-500" />
            <button
              className="w-8 h-8  flex justify-center items-center bg-blue-600 rounded-full absolute -bottom-1 -right-1 cursor-pointer"
              type="button"
              onClick={onchoosefile}
            >
              <LuUpload />
            </button>
          </div>
        ) : (
          <div className="relative">
            <img src={preview} alt="profile pic" className="w-20 h-20 rounded-full object-cover" />
            <button className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1" type="button" onClick={removeimage}>
              <LuTrash />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profilepic;
