export const BASE_URL = "https://mern-taskmanagement-backend.onrender.com";

export const API_URLS = {
    AUTH:{
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
    },
    USERS:{
        GET_ALL_USERS: "/api/user",
        GET_USER_BY_ID: (userid) => `/api/user/${userid}`,
        UPDATE_USER: (userid) => `/api/user/${userid}`,
        DELETE_USER: (userid) => `/api/user/${userid}`,
    },
    TASKS:{
        GET_DASHBOARD_DATA: "/api/task/dashboard-data",
        GET_USER_DASHBOARD_DATA: "/api/task/user-dashboard-data",
        CREATE_TASK: "/api/task",
        GET_ALL_TASKS: "/api/task",
        GET_TASK_BY_ID: (taskid) => `/api/task/${taskid}`,
        UPDATE_TASK: (taskid) => `/api/task/${taskid}`,
        DELETE_TASK: (taskid) => `/api/task/${taskid}`,

        UPDATE_TASK_STATUS: (taskid) => `/api/task/${taskid}/status`,
        UPDATE_TODO_CHECKLIST: (taskid) => `/api/task/${taskid}/todo`,  
    },
    REPORTS:{
        EXPORT_TASKS: "/api/report/taskreport",
        EXPORT_USERS: "/api/report/userreport",
    },
    image:{
        UPLOAD_IMAGE: "/api/auth/upload-image",
    }
}
