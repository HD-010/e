/**
 * list  执行的函数列表
 * syncHandel 执行完成后的回调
 * 要点：
 调用sync方法需要预告定义一个对象，对象名称为：syncData 来接收每个方法执行的结果
    var syncData = {};
    并且定义一个错误数据对象，对象名称为：syncError 作为出错时返回的结果，如：
    var syncError = {error:1,messge:'函数执行错误',uri:'error'};
    并且每个每被调用的方法，执行得到的结果，都要写入syncData对象，属性名称需要与该方法名称一致，如：
    function fnc1(){
    var res = "this is f1";
    syncData['fnc1'] = res;
    console.log(res);
}
另外：每个方法执行返回的结果要求是一个对象，格式如：
结果无误：{error:0,...},
结果有误：{error:1,...},

调用：
var sync = require('sync');
sync(['fnc1','fnc2','fnc3'],()=>{
    funcEnd();
});

    * 
    */
function Sync(list,syncHandel){
    var state = 'success'; // waite|faile|end
    var func = '';          //当前执行的方法
    list = list || [];

    var psSync = setInterval(()=>{
        if((state === 'success') && (list.length > 0)){
            state = 'waite';
            func = list.shift();
            eval('if(typeof ' + func + ' === "function"){' + func + '()}else{state = "faile"}');
            if(state === 'faile') {
                syncError.message = func + '执行错误';
                syncData = syncError;
            }
        }

        //对单个方法执行的结果进行分析，如果有误，则不再执行后续方法。
        if(func in syncData) {
            if(syncData[func].error === 1){
                state = 'faile';
                syncData = syncError;
            }else{
                state = 'success';
            }
        }
        if(list.length === 0) state = 'end';
        if((state === 'end') || (state === 'faile')){
            clearInterval(psSync);
            syncHandel();
        }
    });
}

module.exports = Sync;