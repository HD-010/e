var fs = require('fs');
var App = require('./vendor/esoft/base/App');


function ws(request){
    console.log(request);
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    
    connection.on('message', function(message) {
        //console.log(message);
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);

            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            
            connection.sendBytes(message.binaryData);
        }

    });
  
    connection.on('close', function(reasonCode, description) {
        
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  }


function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

module.exports = ws;