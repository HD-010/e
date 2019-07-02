function Router() {
    
    this.init = function(req){
        var pathname = req.originalUrl;
        var pathPoint = req.originalUrl.indexOf("?");
        var urlPath = (pathPoint == -1) ? pathname : pathname.substr(0,pathPoint);
        var path = processPathName(urlPath.substr(1).split('/'));
        if(req.router) throw({error: 1, message: '路由被重置！', point: 'Router.init'});
        var router = new Object();
        switch(path.length % 2){
            case 0:
                router.state = 1;
                router.data = [path[0],path[1]];
                break;
            case 1:
                router.state = 1;
                router.data = [path[0],path[1],path[2]];
                break;
            default :
                break;
        }
        router.string = '/' + router.data.join('/');
        router.params = urlPath.substr(router.string.length + 1);
        req.router = router;
    }

    /**
     * 处理路径名称,将字符‘-x’转换成‘X’
     * @param {*} arr 
     */
    function processPathName(arr){
        var linePoint,sourceStr,newStr;
        var routeArr = [];
        for(var i = 0 ; i < arr.length; i++){
            linePoint = arr[i].indexOf('-');
            if(linePoint === -1) continue;
            sourceStr = arr[i].substr(linePoint,2);
            newStr = (arr[i].substr(linePoint+1,1)).toUpperCase();
            var reg = new RegExp(sourceStr,'g');
            arr[i] = arr[i].replace(reg,newStr);
        }
        return arr;
    }
}

module.exports = Router;