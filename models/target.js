var mongoose = require('mongoose');

var targetSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: String,
  description: String,
  type: String,
  pictures: String
});

module.exports = mongoose.model('Target', targetSchema);
