import React, { useContext } from "react";
import Authlayout from "../components/layout/Authlayout";
import Input from "../components/input/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { vailidatorEmail } from "../utils/helper";
import Profilepic from "../components/layout/Profilepic";
import axiosInstance from "../utils/axiosinstance";
import { API_URLS } from "../utils/apipaths";
import { UserContext } from "../context/UserContext";
import uploadimage from "../utils/uploadimage";

const Signup = () => {
  const [email, setEmail] = useState();
  const [profilepic, setProfilepic] = useState("");
  const [fullname, setFullname] = useState("");
  const [adminInviteToken, setadmininvitetoken] = useState("user");
  const [password, setPassword] = useState();
  const [error, setError] = useState(null);
  const {updateuser} = useContext(UserContext);
  const navigation = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullname) {
      setError("All fields are required");
      return;
    }
    if (!vailidatorEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    let profileImageUrl = "";

    try {
      if (profilepic) {
        const imageupload = await uploadimage(profilepic);
        profileImageUrl = imageupload.imageUrl || "";
      }
      const respones = await axiosInstance.post(API_URLS.AUTH.REGISTER, {
        name: fullname,
        email,
        password,
        adminInviteToken,
        profileImageUrl,
      });
      const { token, role } = respones.data;
      if (token) {
        localStorage.setItem("token", token);
        updateuser(respones.data);
        if (role === "admin") {
          navigation("/admin/dashboard");
        } else {
          navigation("/user/dashboard");
        }
      }
    } catch (error) {
      if (
        error.respones &&
        error.respones.data &&
        error.respones.data.message
      ) {
        setError(error.respones.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }

    setError("");
  };
  return (
    <Authlayout>
      <div className="lg:w-[100%] h-full md:h-full flex flex-col justify-center items-center ">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs font-medium text-slate-700 mt-5 mb-5">
          Please inter your detail to signup
        </p>

        <form onSubmit={handleSubmit}>
          <Profilepic image={profilepic} setimage={setProfilepic} />
          <Input
            value={fullname}
            onChange={({ target }) => setFullname(target.value)}
            label="Full Name"
            placehoder="Enter your full name"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placehoder="Enter your email"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placehoder="Enter your password"
            type="password"
          />
          <Input
            value={adminInviteToken}
            onChange={({ target }) => setadmininvitetoken(target.value)}
            label="Admin Invite Token "
            placehoder="Enter admin invite token"
            type="text"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button className="btn-primary">Signup</button>

          <p className="text-xs text-slate-700 mt-3">
           have an account?
            <Link
              to={"/singup"}
              className="text-blue-600 cursor-pointer underline text-sm"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </Authlayout>
  );
};

export default Signup;
