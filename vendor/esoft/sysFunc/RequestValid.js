/**
 * 请求验证调用说明
 * 方法组用于验证用户的请求是否同一个用户在同一个客户端登录后持继请求。
 * 使用流程：
 * 当用户登录成功时创建签名，并将生成的openID传给请求客户端。
 * 当用户再次发起请求时，须要携带openID
 * 在服务器处理客户端请求前，需要验证签名 validSignature（）
 */
/**
 * 创建签名
 * req 请求对象
 * userInfor 用户登录信息,如：
 * {uid:'',loginTime:'' } 
 */
global.createSignature = function(req,userInfor){
    var utility = require('utility');
    var uid = userInfor.id;
    var loginTime = userInfor.loginTime;
    var userAgent = req.headers['user-agent'];
    var remoteAddress = req._remoteAddress;
    if(!uid || !loginTime || !userAgent || !remoteAddress) return false;

    return (utility.md5(uid + loginTime + userAgent + remoteAddress)).substr(1,30);
}

/**
 * 获取openID
 * sg 签名字串
 * uid 登录用户id
 */
global.createOpenID = function(req,userInfor){
    var uidStr = userInfor.id.toString();
    var signature = createSignature(req,userInfor);
    if(!signature) return false;
    var size = Math.ceil(signature.length / uidStr.length);
    var openID = temStr = "";
    for(var i = 0; i < uidStr.length; i ++){
        temStr = signature.substr(i*size,size) + uidStr[i];
        openID += temStr;
    }

    return openID + uidStr.length.toString(16);
}


/**
 * 解析openID
 * openID 客户请求时传来的openID
 * uid 登录用户id
 */
global.parseOpenID = function(openID){
    //uid长度标识
    var uidTag = openID.substr(-1,1);
    var uidLen = parseInt(uidTag,16);
    openID = openID.substr(0,openID.length - 1);  //减法一位uid长度标识符
    var size = Math.ceil((openID.length - uidLen) / uidLen);
    var data = {sg:"",id:""};
    
    for(var i = 0; i <= uidLen; i ++ ){
        data.sg += openID.substr(i * size + i, size);
        data.id += openID.substr((i+1) * size + i + 1, 1);
    }
    data.id += data.sg.substr(30,uidLen);
    data.sg = data.sg.substr(0,30);
    return data;
}