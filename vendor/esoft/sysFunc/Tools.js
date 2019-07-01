var fs = require('fs');
var path = require('path');

global.log = console.log;

/**
 * 判断请求是否ajqx请求
 * 是返回真，否返回否
 */
global.isAjax = function(req){
	var XMLHttpRequest = req.headers['x-requested-with'];
	return (XMLHttpRequest === 'XMLHttpRequest') ? true : false;
}


/**
 * 将查询记录中的JSON对象转换为js对象
 * recods 查询记录
 * key string 指定需要转换的key对应的值 ，如果不指，则会检查记录的所有键值，一旦发现是josn对象，会被pasre
 */
global.recodeJsonParse = function(recods,key){
	var temVal = '';
	if(recods.constructor.name != "Array") recods = [recods];
	if(key){
		for(var i = 0; i < recods.length; i ++){
			if(recods[i][key]){
				try{
					temVal = JSON.parse(recods[i][key]);
				}catch(e){
					temVal = recods[i][key];
				}
				recods[i][key] = temVal;
			}
		}
	}else{
		for(var i = 0; i < recods.length; i ++){
			for(var k in recods[i]){
				try{
					temVal = JSON.parse(recods[i][k]);
				}catch(e){
					temVal = recods[i][k];
				}
				recods[i][k] = temVal;
			}
		}
	}
	return recods;
}

/**
 * 将查询记录中的base64对象解码
 * recods 查询记录
 * key array | string 指定需要转换的key对应的值 ，如果不指，则会检查记录的所有键值，一旦发现是base64对象，会被pasre
 */
global.recodeBase64decode = function(recods,key){
	var utility = require('utility');
	var temVal = '';
	if(recods.constructor.name != "Array") recods = [recods];
	if(typeof key == 'string'){
		for(var i = 0; i < recods.length; i ++){
			if(recods[i][key]){
				try{
					temVal = utility.base64decode(recods[i][key]);
				}catch(e){
					temVal = recods[i][key];
				}
				recods[i][key] = temVal;
			}
		}
	}else{
		for(var i = 0; i < recods.length; i ++){
			for(var k in recods[i]){
				if((typeof key == 'object') && !(key.indexOf(k)+1)) continue;
				try{
					temVal = utility.base64decode(recods[i][k]);
				}catch(e){
					temVal = recods[i][k];
				}
				recods[i][k] = temVal;
			}
		}
	}
	return recods;
}