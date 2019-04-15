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
 * 方法根据key1=>value在array中查找相对的对象，并返回对象中key2的值
 */
global.array2value = function(array,key1,value,key2) {
	array = array || [];
    if(!array.length) return '';

    for(var i = 0; i < array.length; i ++){
		if(array[i][key1] == value) return array[i][key2];
	}
	return '';
}