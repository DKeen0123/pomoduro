const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/projectModel');

router.post('/', auth, async (req, res) => {
  try {
    const { name, complete } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'no name was given' });
    }

    const newProject = new Project({
      name,
      userId: req.user,
      complete: !complete,
    });

    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
