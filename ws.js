var fs = require('fs');
var wsProcess = require('./wsProcess');


/**
 * ws使用说明：
 * 在客户端send()的数据要求是json对象，对象包含以下属性：
 * 1、action: 指向操作，可以由/controler/action组成，也可以由/modules/controler/action组成
 * 2、data:传入的数据对象。在服务端与body 和 query对应（在这里body和query的数据相同）
 * @param {*} request 
 */
function ws(request){
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      //console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    var connection = request.accept('echo-protocol', request.origin);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //将message.utr8Data对象重组，让其与e框架兼容
            var wsRequest = message.utf8Data;
			
            try{
                wsRequest = JSON.parse(wsRequest);
            }catch(error){}
            if(!wsRequest) {
                wsRequest = {
                    action: '',
                    query: new Object(),
                    body: new Object()
                }
            }
            //定义req对象
            var req = res = connection;
			req.originalUrl = wsRequest.action || '';
			req.query = wsRequest.data || new Object();
			req.body = wsRequest.data || new Object();
			req.locals = new Object()
            
			//定义res对象
			res.send = connection.sendUTF;
			res.json = function(data){
				var jsonStr = data;
				try{
					jsonStr = JSON.stringify(data);
				}catch(error){}
				connection.sendUTF(jsonStr);
			}
            //执行处理程序
            wsProcess(req,res);
        }else if (message.type === 'binary') {
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