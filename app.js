var express = require('express');
var fs      = require('fs');
var router  = express.Router();

router.get('/*',Request);
router.post('/*',Request);

function Request(req,res,next){
    if(isRel(req)) return res.render('error',{message: '文件不存在',error:{status: 404,stack:''}});
    if(typeof times == 'undefined') global.times = 0;
    req.env = 'dev';
    //初始化App
    req.eState = (new (require('./vendor/esoft/base/App'))).init();
    //载base对象
    var base = new (require('./vendor/esoft/base/Base'))();
    //初始化配置文件
    base.initConfigures(req);
    //初始化数据库类型;
    base.initDBService(req);
    //初始化路由
    base.initRouter(req);
    //初始化模块类
    base.initModel(req);
    //初始化服务类
    base.initService(req);
    //初始化插件类
    base.initPlug(req);

    //实例化behavior
    var behavior = base.initBehavior(req);
    behavior.req = req;
    behavior.res = res;
    req.eState.feeler(res,behavior,function(){
        return req.eState.interaction(req,res,base);
    });
    
    
    //log("=+++++++++++++++++++++++++++",behavior);
    //当前步骤前需要插入req.eState.feeler()
    //return req.eState.interaction(req,res,base);
    
    
    // if(req.originalUrl == '/tools/test/ab'){
    //     times ++;
    //     var data = {
    //         error: 0,
    //         message: "this is 11111111111",
    //         times: times
    //     }

    //     var connect = req.DBService.init(req);
    //     connect.get({
    //         table: ['youbang_sys_template_users']
    //     },function(err,results){
            
    //         res.json(results)
    //     });
    // }

    // if(req.originalUrl == '/tools/test2/ab'){
    //     times ++;
    //     var data = {
    //         error: 0,
    //         message: "this is 22222222222222",
    //         times: times
    //     }
    //     var connect = req.DBService.init(req);
    //     connect.get({
    //         table: ['youbang_sys_acount_type']
    //     },function(err,results){
    //         res.json(results)
    //     });
        
    // }
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