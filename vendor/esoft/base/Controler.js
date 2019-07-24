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
        eval(('usedLayouter = ' + usedName + '(this.router.data)'));
        usedLayouter = 'layouter/'+usedLayouter;
    }catch(error){
        usedLayouter = 'layouter/'+usedName;
    }
    
    this.layouter = usedLayouter;
}

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
    var backUri = this.POST('backuri',{default:this.GET('backuri',{default:''})});
    if(data != _data){
        throw({
            error  : 1,
            message: '调用 renderJson()方法时，传入的参数类型错误!',
            data   : data
        });
    }
    if(backUri) _data.uri = backUri;
    this.res.json(_data);
    return;
}

/**
 * 尝试返回渲染视图，如查控制器中查询未结束，则不渲染
 * data object 一次查询得到的结果，须添加error属性，标识查询成功还是失败
 * 结构如：{error:0,results:res}
 * ps number 步查看的子进程数 
 */
Controler.prototype.testRender = function(data,ps,view,auto){
    ps --;
    if(data.error || !ps) return view ? this.render(data) : this.render(data, view);
    view = view || auto;
    if(data.error || !ps) return auto ? this.render(data, view) : this.render(data, view, auto);

    return ps;
}


/**
 * 尝试返回json，如查控制器中查询未结束，则不返回
 * data object 一次查询得到的结果，须添加error属性，标识查询成功还是失败
 * 结构如：{error:0,results:res}
 * ps number 步查看的子进程数 
 */
Controler.prototype.testRenderJson = function(data,ps){
    ps --;
    if(data.error || !ps) return this.renderJson(data);
    return ps;
}


/**
 * 定向到指定的路由
 */
Controler.prototype.go = function(){
    log("==============||||",this.app);
    //this.app.interaction(this.req,this.res,this.base);
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