function Router(req) {
    this.urlPath = '';
    
    this.init = function(base){
        var pathname     = req.originalUrl;
        var pathPoint    = pathname.indexOf("?");
            this.urlPath = (pathPoint == -1) ? pathname : pathname.substr(0,pathPoint);
        var path         = this.urlPath.substr(1).split('/');
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
}

module.exports = Router;