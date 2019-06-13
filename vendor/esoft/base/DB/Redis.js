
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
        data = data || {};
        if(typeof data === 'object') data = JSON.stringify(data);
        this.client.set(this.configures.prefixed + name,data,(err,resusts) => {
            if(typeof callback === 'function'){
                callback(err,resusts);
            }
        });
    }

    /**
     * 获取数据
     */
    this.get = function(name,callback){
        this.client.get(this.configures.prefixed + name,function(err,results){
            if(err) return callback(err,{});
            var data;
            try{
                data = JSON.parse(results)
            }catch(e){}
            if(data) results = data;
            return callback(err,results);
        });
    }

}

module.exports = Redis;