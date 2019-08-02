function Respons(){
    this.init = function(req){
        req.locals.print_r = this.print_r;
        req.locals.echo = this.echo;
        
        return req;
    }

    /**
     * 格式化输入信息
     */
    this.print_r = function(data){
        return '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    };

    /**
     * 将字符串输出到视图
     */
    this.echo = function(str,def){
        return str || def || '';
    }
}

module.exports = Respons;