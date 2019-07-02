var fs = require('fs');
var util = require('util');

function DBService(){
    this.data = [];
    this.DBConnect = [];

    /**
     * 实例化指定数据库连接，默认是mysql
     * @param {*} dBServiceName 
     * req 必须
     * dBServiceName 数据库配置标识，默认'Mysql'
     */
    this.init = function(req,dBServiceName){
        dBServiceName = dBServiceName || 'Mysql';
        var DBConfigure = req.eState.confs('database');
        
        if((Object.keys(DBConfigure).indexOf(dBServiceName) == -1)) {
            throw('数据库' + dBServiceName + '配置项不存在');
        }
            
        dBServiceName = DBConfigure[dBServiceName].typeName;
        //开启数据库连接对象在内存中共享
        if(typeof appDBConnect === 'undefined') global.appDBConnect = [];
        if(appDBConnect[dBServiceName]) return appDBConnect[dBServiceName].init();
        
        var dBService = this.data[dBServiceName];
        eval(('dBService = new ' + dBService + '()'));
        dBService.configures = DBConfigure;
        appDBConnect[dBServiceName] = dBService;

        return appDBConnect[dBServiceName].init();
    }

    /**
     * 初始化模块类
     * @param {*} App 
     * @param {*} dBServicePath 
     */
    this.initDBService = function(req,dBServicePath){
        var that = this;
        var path = dBServicePath;

        var files = fs.existsSync(path) ? fs.readdirSync(path) : [];
        files.forEach(function(file){
            //获取文件名作为对象名（文件名称与对象名称一至）
            var objName = file.split('.')[0];
            //console.log('FILENAME:',file);
            //跳过config对象中存在的同名的配置文件信息
            if(!(objName in that.data) && fs.existsSync(path + '/' +file)) {
                //读取配置到config对象
                //console.log("正在加载配置文件：",path + '/' + file);
                that.data[objName] = require(path + '/' + file);
            }
        });
        //console.log("配置文件初始化完成！");
        req.eState.dBService.state = 1;
    }
}

module.exports = DBService;