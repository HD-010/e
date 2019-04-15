var fs = require('fs');
var path = require('path');

global.log = function(content){
	content = content || '';
	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
	if(content.constructor.name === 'Array'){
		content.forEach(function(v){
			console.log("\n\r",v,"\n\r");
		})
	}else{
		console.log("\n\r",content,"\n\r");
	}
	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
}

/**
 * 判断请求是否ajqx请求
 * 是返回真，否返回否
 */
global.isAjax = function(req){
	var XMLHttpRequest = req.headers['x-requested-with'];
	return (XMLHttpRequest === 'XMLHttpRequest') ? true : false;
}

