var util = require('util'); 
var fs = require('fs');
function Base(App){
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

    //初始化App
    this.initApp = function(){
        App.init();
    };

    //初始化配置文件
    this.initConfigures = function(){
        try{
            App.configures = appConfigures;
            return;
        }catch(err){
            //console.log("初始化配置文件");
            var configures = require('./Configures');
            configures.init(App);
            global.appConfigures = App.configures;
        }
    };

    //初始化路由
    this.initRouter = function(req){
        var Router = require('./Router');
        var router = new Router();
        router.pathname = req.originalUrl;
        router.init(this);
    };

    //初始化控制器
    this.initControler = function(req,res){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter();
        //控制器路径
        var controlDir  = App.param('controlDir');
        var controlPath = this.processControlerPath(controlDir,'Controler');
       
        // console.log(controlPath);
        //载入控制器
        if(!fs.existsSync(controlPath + '.js')) {
            return {
                error  : 1,
                status : '5060',
                message: "控制器:" + controlPath + '不存在',
            };
        }
        var control                    = require(controlPath);
     
        var Controler                  = require('./Controler');
            Controler.prototype.router = this.router;
            Controler.prototype.app    = App;
        //继承Controler        
        util.inherits(control,Controler);
        //实例化用户定义的逻辑控制器
        var controler = new control(res,res);
        controler.initLayouter();
        controler.req = req;
        controler.res = res;
        controler.base = this;

        return controler;
    };

    //初始化控制器
    this.initBehavior = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter();
        //载入Behavior控制器
        var Behavior                    = require('./Behavior');
        var Controler                  = require('./Controler');
            Controler.prototype.router = this.router;
            Controler.prototype.app    = App;
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
        this.checkRouter();
        var Service = require('./Service');
        App.service = new Service(req);
        //服务类路径,在/configs/params.js中配置
        var serviceDir  = App.param('serviceDir');
        var servicePath = this.processPath(serviceDir);
        
        App.service.req = req;
        App.service.app = App;
        App.service.serviceDir = servicePath;
        App.service.state  = 1;
    };

    //初始化模块
    this.initModel = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter();
        var Model = require('./Model');
        var model = new Model(req);
        App.model = model;
        //模块类路径，在/configs/params.js中配置
        var modelDir = App.param('modelDir');
        var modelPath = this.processPath(modelDir);
        App.router = this.router;
        App.model.req = req;
        App.model.app = App;
        App.model.modelDir = modelPath;
        App.model.state = 1;
    };

    //初始化数据库连接服务
    this.initDBService = function(){
        //if(App.dBService.state) return;
        var DBService     = require('./DBService');
        var DBServicePath = __dirname + '/DB';
        DBService.initDBService(App,DBServicePath);
        App.dBService = DBService;
    };

    //初始插件
    this.initPlug = function(req){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        this.checkRouter();
        try{
            App.plug = appPlug;
        }catch(err){
            var Plug           = require('./Plug');
            global.appPlug = Plug;
        }

        //插件路径,在/configs/params.js中配置，如果没有则加载系统rt
        var sysPlugDir = __dirname + '/../plug';
        var plugDir    = [sysPlugDir];
        var userPlug   = App.param('plugDir');
        if(userPlug) {
            var plugPath = this.processPath(userPlug);
            plugDir.push(plugPath);
        } 
            
        App.plug.req = req;
        App.plug.app = App;
        App.plug.plugDir = plugDir;
        App.plug.state = 1;
    };

    /**
     * 处理App模型路径
     */
    this.processPath = function(dirName){
        var path = "";
        switch(this.router.data.length){
            case 2: 
                path = App.root + dirName;
                break;
            case 3: 
                path = App.root +
                "/modules/" + this.router.data[0] + 
                dirName;
                break;
        };
        return path;
    };

    /**
     * 处理控制器路径
     */
    this.processControlerPath = function(dirName,typeName){
        var path = "";
        switch(this.router.data.length){
            case 2: 
                path = App.root + dirName +
                "/" + this.router.data[0] + typeName;
                break;
            case 3: 
                path = App.root + '/modules/' + this.router.data[0] +
                dirName +
                "/" + this.router.data[1] + typeName;
                break;
        };

        return path;
    };

    /**
     * 检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
     */
    this.checkRouter = function(){
        //检测路由初始化状态，如果初始化失败测载入配置文件中的默认路由
        if(!this.router.state){
            var defaultRouter    = App.configures.data.params.defaultRouter;
                this.router.data = [
                defaultRouter[0],
                defaultRouter[1]
            ];
            if(defaultRouter.length == 3) this.router.data.push(defaultRouter[2]);
            
            this.router.state = 1;
            //console.log("路由状态：",this.router);
        }
    };

}

module.exports = Base;