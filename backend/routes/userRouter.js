const router = require('express').Router();
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: 'not all fields have been entered' });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: 'the password must be atleast 5 characters long' });
    }

    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: 'enter the same password twice for verification' });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: 'an account with this email already exists' });
    }

    if (!displayName) {
      displayName = email;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'not all fields have been entered' });
    }

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: 'no user matching these credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: 'no user matching these credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log(token);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findByIdAndDelete(verified.id);
    if (!user) return false;

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
