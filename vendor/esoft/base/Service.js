var fs = require('fs');
var util = require('util');

function Service(req){
    this.data = [];
    this.serviceDir = '';
    /**
     * 实例化指定模块
     * @param {*} serviceName 
     */
    this.init = function(req,serviceName,data){
        var servicePath = (data.modulePath) ? 
        data.modulePath + '/services/' + serviceName + 'Service' :
        this.serviceDir + '/' + serviceName + 'Service';
        
        try{
            var loadService = require(servicePath);
            var common = require('./Common');
            loadService.prototype.req  = req;
            util.inherits(loadService,common);
            var service = new loadService();
            service.req = req;
            this.data[serviceName] = service;
        }catch(err){throw(err);}

        return service || new Object();
    };
}

module.exports = Service;