function Respons(){
    this.init = function(req){
        req.locals.print_r = this.print_r;
        
        return req;
    }

    this.print_r = function(data){
        return '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
    };
}

module.exports = Respons;
