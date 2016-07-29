var mongoose = require('mongoose');
var Rate = require('./event').Rate;

var voteSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  event_id: String,
  target_id: String,
  voter_id: String,
  voted_time: { type: Date, default: Date.now },
  voted_rate: [{ type: Schema.Types.ObjectId, ref: 'Rate' }]
});

module.exports = mongoose.model('Vote', voteSchema);
