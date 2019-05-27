var fs = require('fs');
var util = require('util');

function Service(req){
    this.data = [];
    this.serviceDir = '';
    /**
     * 实例化指定模块
     * @param {*} serviceName 
     */
    this.init = function(serviceName,data){
        var servicePath = (data.modulePath) ? 
        data.modulePath + '/services/' + serviceName + 'Service' :
        this.serviceDir + '/' + serviceName + 'Service';
        
        try{
            var loadService                = require(servicePath);
            var common                     = require('./Common');
            loadService.prototype.app  = this.app;
            util.inherits(loadService,common);
            var service = new loadService();
            service.req = req;
            this.data[serviceName] = service;
        }catch(err){
            console.log(err.Error);
        }

        return service || new Object();
    };
}

module.exports = Service;