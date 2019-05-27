/**
 * onmessage处理程序
 * @param {*} req 
 * @param {*} res 
 */
function wsProcess(req,res){
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


module.exports = wsProcess;