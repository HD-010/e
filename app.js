var express = require('express');
var fs      = require('fs');
var router  = express.Router();

router.get('/*',(req,res,next)=>{new Request(req,res,next)});
router.post('/*',(req,res,next)=>{new Request(req,res,next)});

function Request(req,res,next){
    if(isRel(req)) return res.render('error',{message: '文件不存在',error:{status: 404,stack:''}});
    
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
        return App.interaction(req,res,base);
    });
}

/**
 * 判断路由是否资源目录
 * @param {*} req 
 */
function isRel(req){
    var fs = require('fs');
    var staticDir = req.originalUrl.split('/')[1];
    staticDir = __dirname + '/../public/' + staticDir;
    return fs.existsSync(staticDir);
}


module.exports = router;