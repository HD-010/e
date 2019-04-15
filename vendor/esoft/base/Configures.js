var fs = require('fs');

var Configures = {
    readFiles: '读取配置文件',
    configPath:'',

    init: function(App){
        //初始化配置文件目录
        this.initPath(App)
        //初始化配置文件
        this.initConfigures(App);
    },
    
    initPath: function(App){
        var env =(App.env === 'pro') ? '/pro' : '/dev'; 
        if(!App.configures.state){
            this.configPath = App.root + '/' + App.configures.dir + env;
            mkdir(this.configPath);
        }
    },

    initConfigures: function(App){
        if(App.configures.state) return;
        App.configures.data = [];
        //配置文件路径
        var path = this.configPath;
        //统计总的配置文件数量
        var files = fs.existsSync(path) ? fs.readdirSync(path) : [];
        files.forEach(function(file){
            //获取文件名作为对象名（文件名称与对象名称一至）
            var objName = file.split('.')[0];
            //console.log('FILENAME:',file);
            //跳过config对象中存在的同名的配置文件信息
            if(!(objName in App.configures.data) && fs.existsSync(path + '/' +file)) {
                //读取配置到config对象
                //console.log("正在加载配置文件：",path + '/' + file);
                App.configures.data[objName] = require(path + '/' + file)[objName];
            }
        });
        //console.log("配置文件初始化完成！");
        App.configures.state = 1;
    }
}

module.exports = Configures;