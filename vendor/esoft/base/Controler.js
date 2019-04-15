var util = require('util');
var fs     = require('fs');
var Common = require('./Common');

/**
 * 控制器
 * 该控制器被用户逻辑控制器继承
 */
function Controler() {}

//继承Common
util.inherits(Controler, Common);

Controler.prototype.initLayouter = function() {
    var module = (this.router.data.length == 3) ? this.router.data[0] + '.' : "";
    var layouterPath = 'layouter.' + module + 'layout';
    var usedLayouter;
    var usedName = 'main';
    try{
        usedName =  appConf('layouter.' + module + 'used') ? 
        appConf('layouter.' + module + 'used') : 
        appConf(layouterPath)[0];
        eval(('usedLayouter = ' + usedName + '()'));
        usedLayouter = 'layouter/'+usedLayouter;
    }catch(error){
        usedLayouter = 'layouter/'+usedName;
    }
    
    this.layouter = usedLayouter;
}

// /**
//  * 请求执行操作前的操作
//  * 该方法依次执行models/BehaviorModel中在ruler属性中描述的所有方法
//  * 请取BehaviorModel对象有符合规则的操作名称，依次执行
//  */
// Controler.prototype.behavior = function(callback) {
//     var data = {
//         error  : 0,
//         message: "请求执行前的操作成功",
//     }

//     var behavior = this.model("Behavior");
//     if (Object.keys(behavior).length === 0) {
//         callback(data);
//         return;
//     }

//     //读取请求前执行的操作名称
//     var ruler                    = [];
//     var router                   = '/' + this.router.data.join('/');
//     var queryStr                 = this.req.originalUrl;
//     var index                    = queryStr.indexOf('?');
//     if  (index !== false) router = router + queryStr.substr(index);

//     for (var v in behavior.ruler) {
//         //if (v === '*') ruler = behavior.ruler[v];

//         if ((v !== '*') && router.match(v)) {
//             ruler = ruler.concat(behavior.ruler[v]);
//             break;
//         }
//     }
    
//     if (ruler.length === 0) {
//         callback(data);
//         return;
//     }

//     //操作执行状态。如果为success，则执行下一个操作；
//     //为waite,则等待上一操作的执行结果
//     //为faile,则当前操作的执行失败
//     //为end,则所有操作的执行结束
//     var state = 'success';
//     var psb   = setInterval(function() {
//         if (ruler.length > 0 && state === 'success') {
//             //将状态设置为waite，让下一操作等待该操作执行完成
//             var func   = ruler.shift();
//             var params = {};
//                 state  = 'waite';
//             if(!(func in behavior)){
//                 state = 'success';
//                 console.log("预执行操作不存在！");
//                 return false;
//             }
//             behavior[func](params, function(bres) {
//                    data = bres;
//                    state = (bres.error === 0) ? 'success' : 'faile';
//                 if (ruler.length === 0) state = 'end';
//             });
//         }

//         if (state === 'end' || state === 'faile') {
//             clearInterval(psb);
//             callback(data);
//             return;
//         }
//     });
// }

/**
 * 如果view为假取默认路径，view为绝对路径取绝对路径，否则取相对路径
 * 在视图可以用config,viewPath两个参数
 */
Controler.prototype.renderLayer = function(data, view) {
    var path     = this.router.data.join('/');
        view     = view || '';
    if (view) {
        path = (view.indexOf('/') == -1) ?
            path.substr(0, path.lastIndexOf('/') + 1) + view: view.substr(1);
    }
    data.viewPath = this.app.root + '/views/' + path + '.html';
    data.config = this.app.param();
    this.res.render(this.layouter, data);
}

/**
 * 该方法用于向客户端响应视图或ajax请求，兼容二者。适用于视图和ajax请求
 * 共用的方法
 * 如果view为假取默认路径，view为绝对路径取绝对路径，否则取相对路径
 * 调用方法：
 * this.render({})  只渲染视图
 * this.render({},true);  自动渲染视图或响应ajax请求
 * this.render({},path);  只渲染指定路径下的视图
 * this.render({},path,true);  渲染指定路径下的视图或响应ajax请求
 * 
 */
Controler.prototype.render = function(data, view, auto) {
    if(typeof view === 'boolean') auto = view;
    auto = (typeof auto === 'boolean') ? auto : false;
    if(auto && isAjax(this.req)) return this.renderJson(data);
    
    data = data || {};
    var path = this.router.data.join('/');
        view = view || '';
    if (view && (typeof view != 'boolean')) {
        path = (view.indexOf('/') == -1) ?
            path.substr(0, path.lastIndexOf('/') + 1) + view: view.substr(1);
    }
    data.viewPath = this.app.root + '/views/' + path + '.html';
    data.config = this.app.param();
    this.res.render(path, data);
}

/**
 * 向客户端返回json对象
 */
Controler.prototype.renderJson = function(data) {
    var _data = (data && (typeof data === 'object')) ? data : {};
    if(data != _data){
        console.log({
            error  : 1,
            message: '调用 renderJson()方法时，传入的参数类型错误!',
            data   : data
        });
    }
    this.res.json(_data);
    return;
}

/**
 * 重定向
 */
Controler.prototype.redirect = function(uri){
    this.res.redirect(uri);
}

/**
 * 返回当前页面的操作权限
 */
Controler.prototype.authority = function(){
    return that.res.authority;
}




module.exports = Controler;