/**
 * 合并多个对象
 * 
var objA = {
	a: '123',
	b: '456',
	c: 'ds'
};
var objB = {
	a : 'oh',
	b : 'hello',
	f : '你好',
	fd: 'world'
}
var objC = {
	a: 'goold',
	e: 'hello',
	b: 'world',
	f: '中华人民共和国'
}
merge([objA,objB,objC]);
结果为：
Object {a: "oh", b: "hello", c: "ds", f: "你好", fd: "world"}
 */
global.mergeObj = function(objs){
	if(objs.constructor !== Array){
		console.log({
			error  : 1,
			message: '传的参数必须是多个对象的数组'
		});
		return false;
	}
	var obj = new Object();
	for(var i = 0; i < objs.length; i++){
		if(objs[i].constructor !== Object){
			console.log({
				error  : 1,
				message: '传参数的元素必须是对象'
			});
			return false;
		}
		for(var k in objs[i]){
			obj[k] = objs[i][k];
		}
	}
    return obj;
}

/**
 * 该方法用于从mysql数据库查询结果中获取所有key的值，以数组返回
 */
global.queryresultKeyValue = function(obj, key) {
    var tem = [];
        obj = obj || {};
    for (var i in obj) {
        if (obj[i][key] === undefined) continue;
        tem.push(obj[i][key]);
    }

    return tem;
}