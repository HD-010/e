/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-27 09:47:19
 * @LastEditTime: 2019-08-19 11:15:43
 * @LastEditors: Please set LastEditors
 */
/**
 * 检测给定的值是否在数组中，如果在则返回true。不在则返回false
 * @param {*} array 
 * @param {*} key 
 */
global.keyExists = function(array,key){
    for(var a in array){
        //console.log(a,"======",key);
        if(a == key) return true;
    }
    return false;
}

/**
 * 方法根据key1=>value在array中查找相对的对象，并返回对象(中key2的值),或返回符合条件的所有对象
 * array array 被查找的多个对象的数组
 * key1 用于匹配的键
 * value 用于匹配的键对应的值,格式为：'比较运算符值',如：'>=10'。表示查找value为大于等于10的项，
 * 可用比较运算符有：>、<、=、<>、>=、<=、!=
 * key2 string  null | key2  null 返回匹配对象， key2 返回匹配对象中 key2 的值
 * all boolean true 返回所有匹配的集合，false 返回第一次匹配               
 */
global.array2value = function(array,key1,value,key2,all) {
	array = array || [];
    if(!array.length) return '';
    if(typeof key2 == 'boolean') {
        all = key2;
        key2 = undefined;
	}
	var temB;
	var temObj = [];
	var valStr = value + '';
	var tag = valStr.match(/(^[!=<>]{1,3})/g);
	if(tag) value = valStr.substr(tag.length + 1);
	tag = tag ? tag[0] : '==';
    for(var i = 0; i < array.length; i ++){
		eval(('temB = (array[i][key1]' + tag  + 'value)'));
		if(!temB) continue;
		if(!all) return key2 ? array[i][key2] : array[i];
		key2 ? temObj.push(array[i][key2]) : temObj.push(array[i]);
	}
	return temObj.length ? temObj : '';
}

/**
 * 方法根据key1=>value在array中查找相对的对象，并返回对象(中key2的值),或返回符合条件的所有对象
 * array array 被查找的多个对象的数组
 * key1 用于匹配的键
 * value 用于匹配的键对应的值,格式为：'比较运算符值',如：'>=10'。表示查找value为大于等于10的项，
 * 可用比较运算符有：>、<、=、<>、>=、<=、!=
 * key2 string  null | key2  null 返回匹配对象， key2 返回匹配对象中 key2 的值
 * all boolean true 返回所有匹配的集合，false 返回第一次匹配               
 */
global.treeValue = function(array,key1,value,key2,all) {
	array = array || [];
	all = all || false;
    if(!array.length) return '';
    if(typeof key2 == 'boolean') {
        all = key2;
        key2 = undefined;
    }
	var temObj = [];
	var valStr = value + '';
	var tag = valStr.match(/(^[!=<>]{1,3})/g);
	if(tag) value = valStr.substr(tag.length + 1);
	tag = tag ? tag[0] : '==';
	for(var i in array){
		var item = array[i];
		for(var k in item){
			if(item[k].constructor.name == 'Array'){
				var values = treeValue(item[k],key1,value,key2,all);
				(values.constructor.name == 'Array') ?
				mergeObj([temObj,values]) :
				temObj = values;
			}else{
				eval(('temB = (array[i][key1]' + tag  + 'value)'));
				if(!temB) continue;
				if(!all) return key2 ? array[i][key2] : array[i];
				key2 ? temObj.push(array[i][key2]) : temObj.push(array[i]);
			}
		}
	}
    
	return temObj;
}

/**
 * 根据对象中的pid 和 id 关系，构造树状结构
 * 要求，根据 pid , id 进行升序排列
 * 必填参数 data: 被构造的原对象
 */
global.treeStrcut = function (data, fa, strucData){
	if(!data.length) return [];
	fa = fa || data[0].pid;
	strucData = strucData || [];
	if(!strucData.length) {
		var childrens = array2value(data,'pid',fa,true);
		if(typeof childrens == 'object') {
			strucData = childrens;
			treeStrcut(data,'',strucData);
		}
	}else{
		strucData.forEach(function(item, index){
			fa = item.id;
			var childrens = array2value(data,'pid',fa,true);
			if(typeof childrens == 'object') {
				strucData[index].children = childrens;
				treeStrcut(data,'',strucData[index].children);
			}
		});
	}
		
	return strucData;
}

/**
 * 从对象中获取与list中值相同键名称的对象
 * @param {object | array} obj 对象结构对象
 * @param {array} list 键名列表
 */
global.list = function(obj,keys){
	if(typeof obj != 'object') return [];
	var tem;
	if(obj.constructor.name == 'Object' || obj.constructor.name == 'RowDataPacket'){
		tem = {};
		for(var i = 0; i < keys.length; i ++) tem[keys[i]] = obj[keys[i]];
	}else{
		tem = [];
		for(var i = 0; i < obj.length; i ++) tem.push(list(obj[i],keys));
	}
	return tem;
}

/**
 * 数据元素求和
 */
global.sum = function(arr){
	eval(('var sum = ' + arr.join('+')));
	return sum;
}

/**
 * 数组去重
 */
global.arrayDistinct = function(arr){
	var tempArr = [];
	var tempObj = {};
	if(arr.constructor.name != 'Array') return tempArr;
	for(var i of arr){
		if(!tempObj[i]){
			tempArr.push(i);
			tempObj[i] = 1;
		}
	}
	
	return tempArr;
}

/**
 * 判断与reg字符串相匹配的字符是否为数组中的元素,是则返回元素对应的索引，否则返回-1
 * arr 数组 如：var a = ['sdf', 'werfw']
 * reg 匹配的字符
 * 调用如：
 * inArray(a,'sd')  //0
 * inArray(a,'^sd') //0
 * inArray(a,'fw')  //1 
 * inArray(a,'fw$')  //1 
 */
global.inArray = function(arr, reg){
	reg = new this.RegExp(reg);
	for(var i = 0; i < arr.length; i ++){
		if(arr[i].match(reg)) return i;
	}
	return -1;
}