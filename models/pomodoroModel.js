const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema(
  {
    lengthInSeconds: { type: Number, required: true },
    userId: { type: String, required: true },
    projectId: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = Pomodoro = mongoose.model('pomodoro', pomodoroSchema);
