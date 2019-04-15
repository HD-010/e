var fs = require('fs');


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
            if(typeof wsRequest != 'object') throw('传入的数据类型错误');

            //定义req对象
            var req = {
                originalUrl : wsRequest.action,
                query: wsRequest.data,
                body:wsRequest.data
            };
            //定义res对象
            var res = {
                send : connection.sendUTF,
                json : function(data){
                    var jsonStr = data;
                    try{
                        jsonStr = JSON.stringify(data);
                    }catch(error){}
                    connection.sendUTF(jsonStr);
                }
            };
            //执行处理程序
            Process(req,res);
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

/**
 * onmessage处理程序
 * @param {*} req 
 * @param {*} res 
 */
function Process(req,res){
    var status =  1;
    var App = new (require('./vendor/esoft/base/App'));
    App.env = 'dev';
    
    //载base对象
    var Base = require('./vendor/esoft/base/Base');
    var base = new Base(App);
    
    //初始化App
    base.initApp();
    //初始化配置文件
    base.initConfigures();
    //初始化数据库类型;
    base.initDBService();
    //初始化路由
    base.initRouter(req);
    //初始化模块类
    base.initModel(req);
    //初始化服务类
    base.initService(req);
    //初始化插件类
    base.initPlug(req);

    //实例化behavior
    var behavior = base.initBehavior();
    behavior.req = req;
    behavior.res = res;
    App.feeler(behavior,function(){
        return interaction();
    });
    
    function interaction(){
        status --;
        if(status === 0){
            //实例化控制器
            var controler = base.initControler(req,res);
            if(controler.error) return res.render('error',controler);
            
            return App.run(base,controler);
        } 
    }
}


module.exports = ws;