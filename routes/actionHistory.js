const express = require('express');
const { logAction, getActionHistory } = require('../models/actionHistory');

const router = express.Router();

router.post('/', async (req, res) => {
  const { shopId, plu, action } = req.body;
  try {
    const history = await logAction(shopId, plu, action);
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log action' });
  }
});

router.get('/', async (req, res) => {
  const filters = req.query;
  try {
    const history = await getActionHistory(filters);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve action history' });
  }
});

module.exports = router;
