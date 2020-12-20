const router = require('express').Router();
const auth = require('../middleware/auth');
const Pomodoro = require('../models/pomodoroModel');
const Project = require('../models/projectModel');
const defaultProjectName = 'unspecified';

router.post('/', auth, async (req, res) => {
  try {
    const { lengthInSeconds, projectName } = req.body;
    if (!lengthInSeconds) {
      return res.status(400).json({ msg: 'no length was given' });
    }

    let projectId;
    let project = await Project.findOne({
      name: projectName,
      userId: req.user,
    });

    if (!project) {
      project = await Project.findOne({
        name: defaultProjectName,
        userId: req.user,
      });

      if (!project) {
        const newProject = new Project({
          name: defaultProjectName,
          userId: req.user,
        });

        const savedProject = await newProject.save();
        projectId = savedProject._id;
      } else {
        projectId = project._id;
      }
    } else {
      projectId = project._id;
    }

    const newPomodoro = new Pomodoro({
      lengthInSeconds,
      userId: req.user,
      projectId,
    });

    const savedPomodoro = await newPomodoro.save();
    res.json(savedPomodoro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/today', auth, async (req, res) => {
  try {
    let start = new Date();
    start.setHours(0, 0, 0, 0);

    let end = new Date();
    end.setHours(23, 59, 59, 999);

    const pomodoros = await Pomodoro.find({
      userId: req.user,
      createdAt: { $gte: start, $lt: end },
    });
    res.json(pomodoros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
