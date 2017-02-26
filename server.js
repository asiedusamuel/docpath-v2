var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9000, path: '/myapp'});
var io = require('socket.io')();
var clients =[];

function removePeer(socket){
     for( var i=0, len=clients.length; i<len; ++i ){
               var c = clients[i];
               if(c.socketID == socket.id){
               clients.splice(i,1);
               console.log(clients);
               break;
               }
          }
}
io.sockets.on('connection', function (socket) {

     socket.on('storePeerInfo', function (data) {
          // First remove existing peer and add new peerInfo
          removePeer(socket);
          // Create a new PeerInfo Object
          var PeerInfo = new Object();
               PeerInfo.peerID         = data.id;
               PeerInfo.socketID     = socket.id;
               clients.push(PeerInfo);
               console.log(clients);
               io.sockets.emit("update-doctors-status", clients);
     });

     socket.on('disconnect', function (data) {
          removePeer(socket);
          io.sockets.emit("update-doctors-status", clients);
     });
     
});

io.listen(9100);