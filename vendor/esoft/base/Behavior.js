function Behavior(){
    /**
     * 请求执行操作前的操作
     * 该方法依次执行models/BehaviorModel中在ruler属性中描述的所有方法
     * 请取BehaviorModel对象有符合规则的操作名称，依次执行
     */
    this.run = function(callback) {
        var data = {
            error  : 0,
            message: "请求执行前的操作成功",
        }

        var behavior = this.model("Behavior");
        if (Object.keys(behavior).length === 0) {
            callback(data);
            return;
        }

        //读取请求前执行的操作名称
        var ruler                    = [];
        var router                   = '/' + this.router.data.join('/');
        var queryStr                 = this.req.originalUrl;
        var index                    = queryStr.indexOf('?');
        if  (index !== false) router = router + queryStr.substr(index);

        for (var v in behavior.ruler) {
            //if (v === '*') ruler = behavior.ruler[v];
            if ((v !== '*') && router.match(v)) {
                ruler = ruler.concat(behavior.ruler[v]);
                //break;
            }
        }
        if (ruler.length === 0) {
            callback(data);
            return;
        }

        //操作执行状态。如果为success，则执行下一个操作；
        //为waite,则等待上一操作的执行结果
        //为faile,则当前操作的执行失败
        //为end,则所有操作的执行结束
        var state = 'success';
        var psb   = setInterval(function() {
            if (ruler.length > 0 && state === 'success') {
                //将状态设置为waite，让下一操作等待该操作执行完成
                var func   = ruler.shift();
                var params = {};
                    state  = 'waite';
                if(!(func in behavior)){
                    state = 'success';
                    console.log("预执行操作不存在！");
                    return false;
                }
                behavior[func](params, function(bres) {
                    data = bres;
                    state = (bres.error === 0) ? 'success' : 'faile';
                    if (ruler.length === 0) state = 'end';
                });
            }

            if (state === 'end' || state === 'faile') {
                clearInterval(psb);
                callback(data);
                return;
            }
        });
    }

}

module.exports = Behavior;