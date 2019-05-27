var fs = require('fs');
var util = require('util');

/**
 * 插件初始化类，初始化目录依次为系统插件目录esoft/plug 和用户在configs/params.sj中指定的plugDir目录
 */
var Plug = {
    data:[],
    plugDir:'',
    /**
     * 实例化指定模块
     * @param {*} plugName 
     */
    init: function(plugName,data){
        var plug = new Object();
        try{
            var plugPath = "";
            for(var i = 0; i < this.plugDir.length; i ++){
                var path = this.plugDir[i] + '/' + plugName + 'Plug';
                if(fs.existsSync(path + '.js')){
                    plugPath = path;
                    //console.log("UUUUUUUUUU:",plugPath);
                    break;
                }
            }
            var loadPlug = require(plugPath);
            if(typeof loadPlug == 'function'){
                var common = require('./Common');
                loadPlug.prototype.req = this.req;
                loadPlug.prototype.res = this.res;
                loadPlug.prototype.next = this.next;
                loadPlug.prototype.app = this.app;
                util.inherits(loadPlug,common);
                data = data || '';
                plug = new loadPlug(data);
            }
            else{
                loadPlug.req = this.req;
                loadPlug.res = this.res;
                loadPlug.next = this.next;
                plug = loadPlug;
            }
        }catch(err){
            console.log(err.Error);
        }
        
        return plug;
    },
}

module.exports = Plug;