var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/datastore');
//mongoose.connect('mongodb://ensor.cs.kuleuven.be:27017/talktalk');

var db_connection = mongoose.connection;
db_connection.on('error', console.error.bind(console, 'connection error:'));
db_connection.once('open', function callback () {

    console.log("Connected to the database");

});


var Schema = mongoose.Schema;

var sessionSchema = new Schema({
    talks: [Schema.Types.Mixed],
    likes: [Schema.Types.Mixed]
},{collection:"Sessions"});


var Sessions = mongoose.model('Sessions',sessionSchema);

exports.Sessions = Sessions;