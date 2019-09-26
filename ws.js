var fs = require('fs');
var utility = require('utility');
var wsProcess = require('./wsProcess');
global.clients = {};			//连接客户端
global.uniClients = {};			//与用户id关联的客户端id

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
	var currentConnectId = "cli_" + utility.md5(connection.frameHeader);
	clients[currentConnectId] = connection;
	
	connection.send = connection.sendUTF;
	connection.json = function(data){
		var jsonStr = data;
		try{
			jsonStr = JSON.stringify(data);
		}catch(error){}
		connection.sendUTF(jsonStr);
	}
	//定义req，res对象
	var req = res = connection;
	connection.curCliId = currentConnectId;
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
            
			req.originalUrl = wsRequest.action || '';
			req.query = wsRequest.data || new Object();
			req.body = wsRequest.data || new Object();
			req.locals = new Object();
			//将用户id（unid）与客户端id（curCliId)进行关联  
			//后面逻辑通过全局方法 uni2cli(unid)获取客户端连接对象
			if(req.body.unid) uniClientId(req.body.unid, currentConnectId);
            //执行处理程序
			res.render = connection.json;
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

/**
 * 关联用户id和客户端id
 * @param {Object} uniId    
 * @param {Object} clientId
 */
function uniClientId(uniId, clientId){
	uniClients[uniId] = clientId;
}


module.exports = ws;