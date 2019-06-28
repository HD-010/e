function Router() {
    this.pathname;
    this.urlPath = '';
    
    this.init = function(base){
        var pathPoint    = this.pathname.indexOf("?");
            this.urlPath = (pathPoint == -1) ? this.pathname : this.pathname.substr(0,pathPoint);
        var path         = processPathName(this.urlPath.substr(1).split('/'));

        switch(path.length % 2){
            case 0:
                base.router.state  = 1;
                base.router.data   = [path[0],path[1]];
                break;
            case 1:
                base.router.state  = 1;
                base.router.data   = [path[0],path[1],path[2]];
                break;
            default :
                break;
        }
        base.router.string = '/' + base.router.data.join('/');
        base.router.params = this.urlPath.substr(base.router.string.length + 1);
        
        // switch(path.length){
        //     case 2: 
        //     case 3: 
        //         base.router.state  = 1;
        //         base.router.data   = path;
        //         base.router.string = '/' + path.join('/');
        //         break;
        //     default: 
        //         break;
        // }
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