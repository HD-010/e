function Router() {
    this.pathname;
    this.urlPath = '';
    
    this.init = function(base){
        var pathPoint    = this.pathname.indexOf("?");
            this.urlPath = (pathPoint == -1) ? this.pathname : this.pathname.substr(0,pathPoint);
        var path         = processPathName(this.urlPath.substr(1).split('/'));
        switch(path.length){
            case 2: 
            case 3: 
                base.router.state  = 1;
                base.router.data   = path;
                base.router.string = '/' + path.join('/');
                break;
            default: 
                break;
        }
        
    }

    /**
     * 处理路径名称
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
            log(arr[i])
        }
        return arr;
    }
}

module.exports = Router;