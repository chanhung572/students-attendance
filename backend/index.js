require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const db = require('./db'); 


//admin routes
const authRoutes = require('./routes-admin/auth');
const accountListRoutes = require('./routes-admin/accountlist');
const totalsListRoutes = require('./routes-admin/totalsList');
const totalsAccountRoutes = require('./routes-admin/totalsAccount');
const rolesRoutes = require('./routes-admin/roles');
const excelRoutes = require('./routes-admin/excel'); 

// user routes
const authUserRoutes = require('./routes-user/auth');
const studentRoutes = require('./routes-user/student');
const contestRoutes = require('./routes-user/createcontest');
const getContestRoutes = require('./routes-user/getcontest');
const totalsRoutes = require('./routes-user/totals');




const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors()); 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// connect routes admin
app.use('/api', authRoutes);
app.use('/api', accountListRoutes);
app.use('/api', totalsListRoutes);
app.use('/api', totalsAccountRoutes);
app.use('/api', rolesRoutes);
app.use('/api', excelRoutes);


// connect routes user
app.use('/api', authUserRoutes);
app.use('/api', studentRoutes);
app.use('/api', contestRoutes);
app.use('/api', getContestRoutes);
app.use('/api', totalsRoutes);


// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});