/*
 * @Description: 关于字符串的扩展方法
 * @Author: your name
 * @Date: 2019-08-14 12:13:00
 * @LastEditTime: 2019-08-14 12:42:10
 * @LastEditors: Please set LastEditors
 */
/**
 * 清除字符串首尾空格
 * str 等处理的字符串
 * handl 可用值-1|0|1  
 * -1 表示清除字符串首空格
 * 1 表示清除字符尾空格
 * 0 清除字符串首尾空格
 */
global.trim = function (str,handl){
    if(handl) return str.replace(/(\s*$)/g, "");
    if(!handl) return str.replace(/(^\s*)|(\s*$)/g, "");
    if(!(handl+1)) return str.replace(/(^\s*)/g, "");
}