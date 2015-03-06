/**
 * Created by svenc on 04/03/15.
 */


var timeEntries = [];
var presenter = -1;
var likes = [];

module.exports = function (io) {
    io.on('connection', function (socket) {
        var address = socket.handshake.address;
        console.log('Client connected with id: ' + socket.id + " from " + address.address + ":" + address.port);

        socket.on('speaking', function (msg) {


            timeEntries.push({participants:msg, timestamp:(new Date().getTime())});
            console.log(timeEntries);
            broadcastStatus(msg);

            broadcastData(timeEntries);

        });
        socket.on('like',function(msg){
            likes.push({like:msg, timestamp:(new Date().getTime())});
            broadcastLikes(likes);
        });

        socket.on('drawVersion',function(msg){

            io.sockets.in('dataListener').emit('drawVersionUpdate', msg);
        });

        socket.on('newSession', function (msg) {
            if(timeEntries.length > 0 || likes.length > 0)
            {
                //save entries
            }
            timeEntries = [];
            likes = [];
            //msg contains who's going to be presenting
            presenter = msg.presenter;
            var nrOfParticipants = msg.nrOfParticipants;
            var names = msg.names;
            console.log(msg);
            broadcastNewSession(presenter, nrOfParticipants, names);

        });

        socket.on("registerStatusListener", function (msg) {
            socket.join('statusListener');
        })

        socket.on("registerDataListener", function (msg) {
            socket.join('dataListener');
        });


    });


///////////////////////////////////////////
//         BroadCasting                  //
///////////////////////////////////////////

    function broadcastStatus(participants) {
        // get last attentionData and emit
        io.sockets.in('statusListener').emit('statusUpdate', participants);
    };
    function broadcastData(data) {
        // get last attentionData and emit
        io.sockets.in('dataListener').emit('dataUpdate', data);
    };
    function broadcastNewSession(presenter, nrOfParticipants,names) {
        var msg = {presenter:presenter, nrOfParticipants:nrOfParticipants, names:names};

        io.sockets.in('statusListener').emit('newSessionStarted', msg);
        io.sockets.in('dataListener').emit('newSessionStarted', msg);
    };
    function broadcastLikes(likes) {
        // get last attentionData and emit
        io.sockets.in('statusListener').emit('likesUpdate', likes);
        io.sockets.in('dataListener').emit('likesUpdate', likes);
    };

}