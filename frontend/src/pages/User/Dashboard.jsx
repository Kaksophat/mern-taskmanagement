import React, { useContext, useEffect } from "react";
import { UseUserAuth } from "../../hooks/Useuserauth";
import { UserContext } from "../../context/UserContext";
import Dashboadlayout from "../../components/layout/Dashboadlayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_URLS } from "../../utils/apipaths";
import moment from "moment";
import { addThousandsSpeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowBigRight, LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable/TaskListTable";
import CustomPiechart from "../../components/Chart/CustomPiechart";
import CustomBarchart from "../../components/Chart/CustomBarchart";

const COLORS = ["#BD51FF","#00B8DB","#7BCE00"];

const UserDashboard = () => {
  UseUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setdashboardData] = useState([]);
  const [pieChartData, setpiechartData] = useState([]);
  const [barchartData, setbarchartData] = useState([]);
  console.log("data", dashboardData);
  console.log("data1", pieChartData);


  const preparechartdata = (data) => {
    const taskdistribution = data?.taskdistribution || null;
    console.log("hello",taskdistribution);
    
    const taskperprioritylevel = data?.taskperprioritylevel || null;

    const taskdistributiondata = [
      { status: "Pending", count: taskdistribution?.Pending || 0 },
      { status: "In Progress", count: taskdistribution?.InProgress || 0 },
      { status: "Completed", count: taskdistribution?.Completed || 0 },

    ];
    setpiechartData(taskdistributiondata);

    const taskperpriorityleveldata = [
      { priority: "Low", count: taskperprioritylevel?.Low || 0 },
      { priority: "Medium", count: taskperprioritylevel?.Medium || 0 },
      { priority: "High", count: taskperprioritylevel?.High || 0 },
    ];
    setbarchartData(taskperpriorityleveldata)
  };

  const getdashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_URLS.TASKS.GET_DASHBOARD_DATA
      );
      console.log(response.data);

      if (response.data) {
        setdashboardData(response.data);
        preparechartdata(response.data?.charts || null)
        
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onSeeMore = () => {
    navigate("/admin/tasks");
  };
  useEffect(() => {
    getdashboardData();
    

    return () => {};
  }, []);


  return (
    <Dashboadlayout activemanu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSpeparator(
              dashboardData?.charts?.taskdistribution?.All || 0
            )}
            color="bg-blue-500"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSpeparator(
              dashboardData?.charts?.taskdistribution?.Pending || 0
            )}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSpeparator(
              dashboardData?.charts?.taskdistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandsSpeparator(
              dashboardData?.charts?.taskdistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex justify-between items-center">
             <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomPiechart
            data={pieChartData}
            colors={COLORS}
            />
          </div>
        </div>
          <div>
          <div className="card">
            <div className="flex justify-between items-center">
             <h5 className="font-medium">Task Distribution</h5>
            </div>

            <CustomBarchart
            data={barchartData}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-black" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recenttasks || []} />
          </div>
        </div>
      </div>
    </Dashboadlayout>
  );
};

export default UserDashboard;
