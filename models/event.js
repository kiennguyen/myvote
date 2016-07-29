var mongoose = require('mongoose');

var rateSchema = new mongoose.Schema({
    id: { type: String, unique: true, index: true },
    value: String,
    description: String
});
var Rate  = mongoose.model('Rate', rateSchema);

var eventSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: String,
  description: String,
  type: String,
  rate: [{ type: Schema.Types.ObjectId, ref: 'Rate' }],
  multichoice: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', eventSchema);
