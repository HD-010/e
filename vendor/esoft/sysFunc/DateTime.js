/**
 * 时间转换方法
 * @param date 中国标准时间 
 */
global.getStandardDate = function(date,defaultVal) {
	defaultVal = defaultVal || '';
    if(!date) return defaultVal;
	var d = new Date(date);
	var Y =d.getFullYear();
	var m  = (d.getMonth().valueOf() + 1);
	var D = d.getDate();
	var h = d.getHours();
	var mi = d.getMinutes();
	var s = d.getSeconds();
	m = m > 9 ? m : '0' + m;
    return Y + '-' + m + '-' + D + ' ' + h + ':' + mi + ':' + s;
}

/**
 * %Y %m %d %H %M %S 分别表示年月日时分秒
 *  */
global.dateFormate = function(formate,time){
	var date = new Date(time);
	var Y = date.getFullYear();
	var m = date.getMonth() > 9 ? date.getMonth() : date.getMonth() + 1;
	var d = date.getDate();
	var H = date.getHours();
	var M = date.getMinutes();
	var S = date.getSeconds();
	var str = formate;
	str = str.replace('%Y',Y);
	str = str.replace('%m',m);
	str = str.replace('%d',d);
	str = str.replace('%H',H);
	str = str.replace('%M',M);
	str = str.replace('%S',S);
	return str;
}


/**
 * --------------------- 
	作者：carllucasyu 
	来源：CSDN 
	原文：https://blog.csdn.net/carllucasyu/article/details/78569525 
	版权声明：本文为博主原创文章，转载请附上博文链接！
 */

global.getWeekOfYear = function(date){
    date = date || null;
  var today = new Date(date);

  var firstDay = new Date(today.getFullYear(),0, 1);
  var dayOfWeek = firstDay.getDay(); 
  var spendDay= 1;
  if (dayOfWeek !=0) {
    spendDay=7-dayOfWeek+1;
  }
  firstDay = new Date(today.getFullYear(),0, 1+spendDay);
  var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
  var result =Math.ceil(d/7);
  return result+1;
};