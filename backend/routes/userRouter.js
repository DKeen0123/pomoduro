const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send('Hello, irts working');
});

module.exports = router;
