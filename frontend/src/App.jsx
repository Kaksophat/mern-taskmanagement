import "./App.css";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTask from "./pages/Admin/ManageTask";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUser from "./pages/Admin/ManageUser";
import Mytask from "./pages/User/Mytask";
import UserDashboard from "./pages/User/Dashboard";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import { useContext } from "react";
import UserProvider, { UserContext } from "./context/UserContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTask />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/user" element={<ManageUser />} />
        </Route>

        {/* User routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<Mytask />} />
          <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
        </Route>

        <Route path="/" element={<Root/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster
      toastOptions={{
        className: '',
        style:{
          fontSize: '14px',
        }
      }}
      />
      </UserProvider>

    </>
  );
}

export default App;

const Root=()=>{
  const {user, loading}= useContext(UserContext);

  if(loading){
    return <Outlet/>
  }
  if(!user){
    return <Navigate to="/login"/>
  }
  return user.role === "admin" ? <Navigate to="/admin/dashboard"/> : <Navigate to="/user/dashboard"/>
}
