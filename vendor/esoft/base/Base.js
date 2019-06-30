var util = require('util'); 
var fs = require('fs');
function Base(){
    //路由对象
    this.router = {
        state: 0,
        data : [],
    };
    //控制器对象
    this.contorler = {
        state: 0,
        data : [],
    };

    //请求处理对象
    this.request = {
        state: 0,
        data : []
    };

    //初始化配置文件
    //配置appConfigures 是全局对象
    this.initConfigures = function(req){
        //console.log("初始化配置文件");
        if(typeof appConfigures === 'undefined') (require('./Configures')).init(req);
    };

    //初始化路由
    this.initRouter = function(req){
        (new (require('./Router'))()).init(req);
    };

    //初始化控制器
    this.initControler = function(req,res){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter(req);
        //控制器路径
        var controlDir  = req.eState.param('controlDir');
        var controlPath = this.processControlerPath(req,controlDir,'Controler');
        //载入控制器
        if(!fs.existsSync(controlPath + '.js')) {
            return {
                error  : 1,
                status : '5060',
                message: "控制器:" + controlPath + '不存在',
            };
        }
        var control = require(controlPath);
        var Controler = require('./Controler');
        Controler.prototype.req = req;
        Controler.prototype.res = res;
        //继承Controler        
        util.inherits(control,Controler);
        //实例化用户定义的逻辑控制器
        var controler = new control();
        controler.initLayouter(req);
        controler.req = req;
        controler.res = res;
        //controler.base = this;

        return controler;
    };

    //初始化控制器
    this.initBehavior = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter(req);
        //载入Behavior控制器
        var Behavior = require('./Behavior');
        var Controler = require('./Controler');
            Controler.prototype.req = req;
        //继承Controler        
        util.inherits(Behavior,Controler);
        //实例化用户定义的逻辑控制器
        var behavior = new Behavior();
        
        return behavior;
    };

    //初始化控制器
    this.initRequest = function(){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter();
        //载入控制器
        var Request                = require('./Request');
            Request.prototype.req  = this.req;
            Request.prototype.next = this.next;
            Request.prototype.app  = App;
        //继承        
        //util.inherits(Request,'');
        //实例化用户定义的逻辑控制器
        var request            = new Request();
            this.request.data  = request;
            this.request.state = 1;
    };

    //初始化服务类
    this.initService = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter(req);
        req.service = new (require('./Service'))(req);
        //服务类路径,在/configs/params.js中配置
        var serviceDir  = req.eState.param('serviceDir');
        var servicePath = this.processPath(req,serviceDir);
        req.service.req = req;
        req.service.serviceDir = servicePath;
        req.eState.service.state  = 1;
    };

    //初始化模块
    this.initModel = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter(req);
        req.model = new (require('./Model'))(req);
        //模块类路径，在/configs/params.js中配置
        var modelDir = req.eState.param('modelDir');
        var modelPath = this.processPath(req,modelDir);
        req.model.req = req;
        req.model.modelDir = modelPath;
        req.eState.model.state = 1;
    };

    //初始化数据库连接服务,创建的连接或连接池是一个超全局对象
    this.initDBService = function(req){
        //if(App.dBService.state) return;

        var DBServicePath = __dirname + '/DB';
        req.DBService = new (require('./DBService'))();
        req.DBService.initDBService(req,DBServicePath);
    };

    //初始插件
    this.initPlug = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter(req);
        if(typeof req.plug == 'undefined'){
            req.plug  = new (require('./Plug'))();
        }

        //插件路径,在/configs/params.js中配置，如果没有则加载系统默认路径
        var sysPlugDir = __dirname + '/../plug';
        var plugDir    = [sysPlugDir];
        var userPlug   = req.eState.param('plugDir');
        if(userPlug) {
            var plugPath = this.processPath(userPlug);
            plugDir.push(plugPath);
        } 
            
        req.plug.req = req;
        req.plug.plugDir = plugDir;
        req.eState.plug.state = 1;
    };

    /**
     * 处理App模型路径
     */
    this.processPath = function(req,dirName){
        var path = "";
        switch(req.router.data.length){
            case 2: 
                path = req.eState.root + dirName;
                break;
            case 3: 
                path = req.eState.root +
                "/modules/" + req.router.data[0] + 
                dirName;
                break;
        };
        return path;
    };

    /**
     * 处理控制器路径
     */
    this.processControlerPath = function(req,dirName,typeName){
        var path = "";
        switch(req.router.data.length){
            case 2: 
                path = req.eState.root + dirName +
                "/" + req.router.data[0] + typeName;
                break;
            case 3: 
                path = req.eState.root + '/modules/' + req.router.data[0] +
                dirName +
                "/" + req.router.data[1] + typeName;
                break;
        };

        return path;
    };

    /**
     * 检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
     */
    this.checkRouter = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        if(!req.router.state){
            var defaultRouter = appConfigures.data.params.defaultRouter;
            req.router.data = [
                defaultRouter[0],
                defaultRouter[1]
            ];
            if(defaultRouter.length == 3) req.router.data.push(defaultRouter[2]);
            req.router.state = 1;
        }
    };

}

module.exports = Base;