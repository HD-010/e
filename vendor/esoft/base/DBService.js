var fs = require('fs');
var util = require('util');

var DBService = {
    app:{},
    data:[],
    DBConnect:[],
    state:0,
    /**
     * 实例化指定数据库连接，默认是mysql
     * @param {*} dBServiceName 
     */
    init: function(dBServiceName){
        dBServiceName = dBServiceName || 'Mysql';
        var DBConfigure = this.app.confs('database');
        if((Object.keys(DBConfigure).indexOf(dBServiceName) == -1)) {
            throw('数据库' + dBServiceName + '配置项不存在');
        }
            
        dBServiceName = DBConfigure[dBServiceName].typeName;
        //开启数据库连接对象在内存中共享
        if(typeof appDBConnect === 'undefined') global.appDBConnect = [];
        if(appDBConnect[dBServiceName]) return appDBConnect[dBServiceName];
        
        var dBService = this.data[dBServiceName];
        eval(('dBService = new ' + dBService + '()'));
        dBService.configures = this.app.confs('database');
        appDBConnect[dBServiceName] = dBService.init();
        return appDBConnect[dBServiceName];
    },

    /**
     * 初始化模块类
     * @param {*} App 
     * @param {*} dBServicePath 
     */
    initDBService: function(App,dBServicePath){
        //if(App.dBService.state) return;
        this.app = App;
        var path = dBServicePath;

        var files = fs.existsSync(path) ? fs.readdirSync(path) : [];
        files.forEach(function(file){
            //获取文件名作为对象名（文件名称与对象名称一至）
            var objName = file.split('.')[0];
            //console.log('FILENAME:',file);
            //跳过config对象中存在的同名的配置文件信息
            if(!(objName in DBService.data) && fs.existsSync(path + '/' +file)) {
                //读取配置到config对象
                //console.log("正在加载配置文件：",path + '/' + file);
                DBService.data[objName] = require(path + '/' + file);
            }
        });
        //console.log("配置文件初始化完成！");
        DBService.state = 1;
    }
}

module.exports = DBService;