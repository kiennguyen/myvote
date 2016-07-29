var mongoose = require('mongoose');

var voterSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: String,
  email: String,
  description: String
});

module.exports = mongoose.model('Voter', voterSchema);
