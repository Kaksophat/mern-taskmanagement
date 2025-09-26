const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db.js'); // Adjusted import to match the file structure
const router = require('./routes/authroute.js'); // Adjusted import to match the file structure
const userRouter = require('./routes/userroute.js'); // Adjusted import to match the file structure
const taskRouter = require('./routes/taskroute.js'); // Adjusted import to match the file structure
const reportRouter = require('./routes/reportroute.js'); 
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api/auth', router); 
app.use('/api/report', reportRouter);
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 3000;
const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT,()=>{
            console.log(`server is running on port ${PORT}`);
            
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

start()


