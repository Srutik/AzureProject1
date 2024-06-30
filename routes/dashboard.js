const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user,
    title: 'Dashboard'
  })
);

module.exports = router;
