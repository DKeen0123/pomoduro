const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = Pomodoro = mongoose.model('project', projectSchema);
