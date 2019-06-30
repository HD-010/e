function App(){
    this.version = 'beta 1.3';
    this.env ='';
    this.root = "";      //框架根目录
    this.configures = {
        discript:'配置文件，在系统运行前需要加载完成。',
        dir: 'configs',  //配置文件存放目录。在项目中默认与e框架在同一层   
        state:0,
    };

    this.model = {
        discript:'模块类，在配置文件加载完成后加载。',
        state:0,
    };

    this.service = {
        discript:'服务类，在配置文件加载完成后加载。',
        state:0,
    };

    this.dBService = {
        discript:'数据库连接类，在配置文件加载完成后加载。',
        state:0,
    };

    this.plug = {
        discript:'插件初始化类，在配置文件加载完成后加载。',
        state:0,
    };

    //状态码
    this.state = {
        error:1,
        //status:'5050',  //访问的模型不存在status:
        //status:'5060',  //访问的控制器不存在
        //status:'5070',  //请求的操作不存在
    };

    //初始化App
    this.init = function(){
        var dirname = __dirname.replace(/\\/g,'/');
        //初始化应用目录
        this.root = dirname.substr(0,dirname.indexOf('/e/'));
        //初始化loadeSysFunc类
        var path = this.root + '/e/vendor/esoft/sysFunc/';
        this.loadeSysFunc(path);

        return this;
    }; 

    //初始化Helper类
    this.loadeSysFunc = function(path){
        var fs = require('fs');
        var files = fs.existsSync(path) ? fs.readdirSync(path) : [];
        files.forEach(function(file){
            //获取文件名作为对象名（文件名称与对象名称一至）
            var objName = file.split('.')[0];
            //console.log("正在加载配置文件：",path + '/' + file);
            require(path + '/' + file)[objName];
        });
    };

    /**
     * 返回系统参数值
     * 系统参数值在/configs/params.js中设置
     * @param {*} paramName 参数名称
     */
    this.param = function(paramName){
        if(!paramName) return appConfigures.data;
        return (paramName in appConfigures.data['params']) ? 
        appConfigures.data['params'][paramName] :
        null;
    };

    /**
     * 返回系统配置
     * 系统配置在/configs/中设置
     * @param {*} paramName 参数名称
     */
    this.confs = function(paramName){
        return appConfigures.data[paramName];
    };

    /**
     * 执行请求
     */
    this.interaction = function(req,res,base){
        //实例化控制器
        var controler = base.initControler(req,res);
        if(controler.error) return res.render('error',controler);
        
        return this.run(req,res,controler);
    }

    /**
     * 运行前的检测
     */
    this.feeler = function(res,detection,callback){
        detection.run(function(data){
            if(data.error !== 0){
                if(data.uri){
                    res.redirect(data.uri);
                    return;
                }
                res.send("验证错误:" + data.message);
                return;
            }
            callback();
        });
    }

    /**
     * 运行app
     * @param {*} base 
     * @param {*} controler 
     * @param {*} res 
     */
    this.run = function(req,res,controler){
        var actionIndex = req.router.data.length - 1;
        var action = req.router.data[actionIndex];
        if(! (action in controler)){
            this.state.message = '找不到您需要的操作！';
            this.state.status = '5070';
            return res.render('error',this.state);
        }
        
        return (controler[action])();
    }
}

module.exports = App;
