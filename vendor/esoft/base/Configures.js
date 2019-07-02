var fs = require('fs');

var Configures = {
    readFiles: '读取配置文件',
    configPath:'',

    init: function(req){
        //初始化配置文件目录
        this.initPath(req)
        //初始化配置文件
        this.initConfigures(req);
    },
    
    initPath: function(req){
        var env =(req.env === 'pro') ? '/pro' : '/dev'; 
        if(req.eState.configures.state) return;
        this.configPath = req.eState.root + '/' + req.eState.configures.dir + env;
        mkdir(this.configPath);
    },
    
    initConfigures: function(req){
        if(req.eState.configures.state) return;
        global.appConfigures = [];
        appConfigures.data = [];
        //配置文件路径
        var path = this.configPath;
        //统计总的配置文件数量
        var files = fs.existsSync(path) ? fs.readdirSync(path) : [];
        files.forEach(function(file){
            //获取文件名作为对象名（文件名称与对象名称一至）
            var objName = file.split('.')[0];
            //console.log('FILENAME:',file);
            //跳过config对象中存在的同名的配置文件信息
            if(!(objName in appConfigures.data) && fs.existsSync(path + '/' +file)) {
                //读取配置到config对象
                //console.log("正在加载配置文件：",path + '/' + file);
                appConfigures.data[objName] = require(path + '/' + file)[objName];
            }
        });
        //console.log("配置文件初始化完成！");
        req.eState.configures.state = 1;
    }
}

module.exports = Configures;