const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
// this middleware allows us to use json
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

// setup mongoose
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) throw err;
    console.log('mongodb connection established');
  }
);

// setup routes
app.use('/users', require('./routes/userRouter'));
app.use('/pomodoros', require('./routes/pomodoroRouter'));
app.use('/projects', require('./routes/projectRouter'));
