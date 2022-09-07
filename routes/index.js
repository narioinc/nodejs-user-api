var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/health', function(req, res, next) {
  res.status(200)
  res.json({})
});

router.get('/live', function(req, res, next) {
  res.status(200)
  res.json({})
});

router.get('/ready', function(req, res, next) {
  res.status(200)
  res.json({})
});

module.exports = router;
