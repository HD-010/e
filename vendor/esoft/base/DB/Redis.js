
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
        var perfixed = appConf('database.Redis.prefixed') || '';
        this.client.set(perfixed + name,data,(err,resusts) => {
            if(typeof callback === 'function'){
                callback(err,resusts);
            }
        });
    }

    /**
     * 获取数据
     */
    this.get = function(name,callback){
        var perfixed = appConf('database.Redis.prefixed') || '';
        this.client.get(perfixed,function(err,results){
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