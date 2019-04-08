var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
	firstname: String,
	email: String,
	request: String
});


module.exports = mongoose.model('Contact', contactSchema);