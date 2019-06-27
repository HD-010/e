/**
 * preg工具类
 */
var Regexp = {
    pattern: {
        number     : '^[0-9]*$',
        email      : '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
        url        : '^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+',
        acount     : '^[a-zA-Z][a-zA-Z0-9_]{4,15}$',                                                                                                                                                    //字母开头，允许5-16字节，允许字母数字下划线
        tel        : '^[a-zA-Z][a-zA-Z0-9_]{4,15}$',                                                                                                                                                    //如 0511-4405222 或 021-87888822
        qq         : '^[1-9][0-9]{4,}$',                                                                                                                                                                //腾讯QQ号从10000开始    
        postcode   : '[1-9]d{5}(?!d)',                                                                                                                                                                  //中国邮政编码
        IDnumber   : 'd{15}|d{18}',                                                                                                                                                                     //匹配身份证
        ip         : '(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)',   //匹配ip地址
        upinit     : '^[1-9]d*$',                                                                                                                                                                       //匹配正整数
        downinit   : '^-[1-9]d*$',                                                                                                                                                                      //匹配负整数
        allinit    : '^-?[1-9]d*$',                                                                                                                                                                     //匹配整数
        nodowninit : '^[1-9]d*|0$',                                                                                                                                                                     //匹配非负整数（正整数 + 0）
        noupinit   : '^-[1-9]d*|0$',                                                                                                                                                                    //匹配非正整数（负整数 + 0）
        upfloat    : '^[1-9]d*.d*|0.d*[1-9]d*$',                                                                                                                                                        //匹配正浮点数
        nodownfloat: '^-([1-9]d*.d*|0.d*[1-9]d*)$',                                                                                                                                                     //匹配负浮点数
        allfloat   : '^-?([1-9]d*.d*|0.d*[1-9]d*|0?.0+|0)$',                                                                                                                                            //匹配浮点数
        nodownfloat: '^[1-9]d*.d*|0.d*[1-9]d*|0?.0+|0$',                                                                                                                                                //匹配非负浮点数（正浮点数 + 0）
        noupfloat  : '^(-([1-9]d*.d*|0.d*[1-9]d*))|0?.0+|0$',                                                                                                                                           //匹配非正浮点数（负浮点数 + 0）
        en_char    : '^[A-Za-z]+$',                                                                                                                                                                     //匹配由26个英文字母组成的字符串
        zh_char    : '^[\\u4e00-\\u9fa5]+$',                                                                                                                                                            //匹配中文字符的正则表达式

    },

    //过滤html符号
    specialHTML: function(s) {
        //var regex = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#……&*（）|{}]");
        var regex = new RegExp("[`~!#$^*()=|{}':;',\\[\\]<>~！@#……*（）：\s|{}]");
        var rs    = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(regex, '');
        }
        return rs;
    },

    //校验数字
    match: function(str, pattern) {
        pattern = this.pattern[pattern];
        if (str.match(pattern)) return true;
        return false;
    },
}


module.exports = Regexp;