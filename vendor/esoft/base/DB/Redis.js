
function Redis(){
    this.configures = {};
    this.client = {};
    this.results = {};

    this.init = function(){
        var port = this.configures.port;
        var host = this.configures.host;
        var redis = require('redis');
        var RedisObj = new Redis();
        RedisObj.client = redis.createClient(port,host);
        return RedisObj;
    }
    
    /**
     * 保存数据
     */
    this.set = function(name,data,callback){
        var name = name;
        data = data || {};
        if(typeof data === 'object') data = JSON.stringify(data);
        this.client.set(name,data,(err,resusts) => {
            if(typeof callback === 'function'){
                callback(err,resusts);
            }
        });
    }

    /**
     * 获取数据
     */
    this.get = function(name,callback){
        this.client.get(name,(err,results) => {
            if(!err){
                if(typeof results === 'string' && 
                (results.indexOf('[') === 1 || results.indexOf('{') === 1)){
                    results = JSON.parse(results);
                } 
            }else{
                results = {};
            }
            callback(err,results);
            return;
        });
    }

}

module.exports = Redis;