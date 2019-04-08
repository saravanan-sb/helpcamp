var mongoose = require('mongoose');

var bookingSchema = new mongoose.Schema({
	name: String,
	number: String,
	guests: String
});


module.exports = mongoose.model('Booking', bookingSchema);