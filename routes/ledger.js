const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const mongoose = require('mongoose');

// GET /ledger?month=YYYY-MM
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: 'month must be YYYY-MM' });
      const items = await Entry.find({ month }).sort({ date: -1, createdAt: -1 });
      return res.json(items);
    }

    const items = await Entry.find().sort({ date: -1, createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /ledger
router.post('/', async (req, res) => {
  try {
    const { date, type, amount, category, note } = req.body;
    if (!date || !type || amount === undefined || !category) {
      return res.status(400).json({ error: 'date, type, amount, category are required' });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
    if (!['income', 'expense'].includes(type)) return res.status(400).json({ error: 'type must be income or expense' });
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'amount must be a number greater than 0' });

    console.log("[POST /ledger] body:", req.body);

    const month = date.slice(0,7);
    const entry = new Entry({ date, month, type, amount, category, note });
    await entry.save();

    console.log("[POST /ledger] saved:", entry._id);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /ledger/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'invalid id' });

    const entry = await Entry.findById(id);
    if (!entry) return res.status(404).json({ error: 'not found' });

    const allowed = ['date','type','amount','category','note'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) entry[key] = req.body[key];
    }

    if (req.body.date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
      entry.month = req.body.date.slice(0,7);
    }

    if (req.body.type && !['income','expense'].includes(req.body.type)) return res.status(400).json({ error: 'type must be income or expense' });
    if (req.body.amount !== undefined && (typeof req.body.amount !== 'number' || req.body.amount <= 0)) return res.status(400).json({ error: 'amount must be a number greater than 0' });

    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /ledger/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'invalid id' });
    const doc = await Entry.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ledger/summary?month=YYYY-MM
router.get('/summary', async (req, res) => {
  try {
    const { month } = req.query;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ error: 'month query required and must be YYYY-MM' });

    const pipeline = [
      { $match: { month } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ];

    const result = await Entry.aggregate(pipeline);
    let totalIncome = 0, totalExpense = 0;
    for (const r of result) {
      if (r._id === 'income') totalIncome = r.total;
      if (r._id === 'expense') totalExpense = r.total;
    }

    res.json({ month, totalIncome, totalExpense, net: totalIncome - totalExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
