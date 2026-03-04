const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  month: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true, min: [0.01, 'Amount must be greater than 0'] },
  category: { type: String, required: true },
  note: { type: String, default: '' }
}, { timestamps: true });

// derive month from date if missing and basic validation
EntrySchema.pre('validate', function(next) {
  if (this.date && !/^\d{4}-\d{2}-\d{2}$/.test(this.date)) {
    return next(new Error('`date` must be in YYYY-MM-DD format'));
  }

  if (this.date && !this.month) {
    this.month = this.date.slice(0,7);
  }

  if (this.month && !/^\d{4}-\d{2}$/.test(this.month)) {
    return next(new Error('`month` must be in YYYY-MM format'));
  }

  next();
});

module.exports = mongoose.model('Entry', EntrySchema);
