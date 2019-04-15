/**
 * 读取配置文件信息，keyLink为configures.data后相应的键
 * 调用形式如：
 * 案例1:appConf();   返回回所能appConfigures对象
 * 案例2:appConf('layouter.snow.layout');  返回layout配置信息
 * 案例3:appConf('database.Mysql');        返回Mysql配置信息
 */

global.appConf = function(keyLink,confs){
    var key,data;
    confs = confs || appConfigures.data;
    if(!keyLink) return appConfigures;
    if(keyLink.indexOf('.') != -1) keyLink = keyLink.split('.');
    key = keyLink.shift();
    data = keyExists(confs,key) ? confs[key] : null;
    if(keyLink.length === 0) return data;
    if(data === null) return data;
    return appConf(keyLink,data);
}

/**
 * 读取对象的值
 * 调用形式如：
 * keyLink:多个键名以'.'连接，一次可读取多层的值，如果值不存在则返回null
 * 案例1:getVal(object,keyLink);          返回layout配置信息
 */
global.getObjectVal = function(object,keyLink){
    object = (!object || (typeof object != 'object')) ? {} : object;
    return appConf(keyLink,object);
}
