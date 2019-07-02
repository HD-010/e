var fs = require('fs');
var util   = require('util');
var multer = require('multer');

function Model(req) {
    this.data = [];
    this.modelDir = '';

    /**
     * 实例化指定模块
     * modelName 是需要初始化的model名称
     * 形式如：
     * 1、modelName
     * 2、:modelName
     * 3、module:modelName
     * 
     * @param {*} modelName 
     */
    this.init = function(req,modelName,data){
        let model;
        //重置不同module的标识
        this.isDiffModule = false;          
        this.iniModelPath(req,modelName);
        
        try{
            let loadModel = require(this.modelPath);
            let common = require('./Common');
            loadModel.prototype.req  = req;
            util.inherits(loadModel,common);
            model = new loadModel();
            model.req = req;
            //记忆当前models所在的modules路径
            if(this.isDiffModule) model.modulePath = this.modelPath.substr(0,this.modelPath.indexOf('/models/'));
            //this.data[modelName] = model;
        }catch(err){throw(err);}
            
        return model;
    };

    /**
     * modelName 是需要初始化的model名称
     * 形式如：
     * 1、modelName
     * 2、:modelName
     * 3、module:modelName
     */
    this.iniModelPath = function(req,modelName){
        //var router = getObjectVal(this.app,'router.data');
        var router = req.router.data;
        var newModule = modelName.split(':');
        
        switch(router.length){
            case 3:
                switch(modelName.indexOf(':')){
                    case -1:
                        this.modelPath = this.modelDir + '/' + modelName + "Model";
                        break;
                    case 0:
                        var appIndex = this.modelDir.indexOf('/app/')
                        this.modelPath = this.modelDir.substr(0,appIndex + 4) + '/models/' + newModule[1] + "Model";
                        this.isDiffModule = true;
                        break;
                    default :
                        this.modelPath = this.modelDir.replace(router[0],newModule[0]) + '/' + newModule[1] + "Model";
                        this.isDiffModule = true;
                        break;
                }
                break;
            case 2:
                switch(modelName.indexOf(':')){
                    case -1:
                    case 0:
                        this.modelPath = this.modelDir + '/' + modelName + "Model";
                        break;
                    default :
                        this.modelPath = this.modelDir + '/../modules/' + newModule[0] + '/models/' + newModule[1] + "Model";
                        this.isDiffModule = true;
                        break;
                }
                break;
        }
    }

    //上传文件
    this.upload = function(obj){
        console.log('上传的文件信息:',obj.req.files);  // 上传的文件信息
        var typeDir = "";
        if(obj.typeDir){
            var d       = new Date();
            var Y       = d.getFullYear();
            var M       = d.getMonth() + 1;
            var D       = d.getDate();
                typeDir = Y + '/' + M + '/' + D + '/';
        }
        var filePath    = this.app.root + this.app.param('sourceDir') + '/' + obj.path + typeDir;
        var MimeType    = require('../lib/MimeType');
        var fileName    = obj.req.files[0].filename;
        var mimeType    = obj.req.files[0].mimetype;
        var contentType = MimeType.getContentType(mimeType);
        var des_file    = filePath + fileName + '.' + contentType;
        //console.log('上传的文件信息:',des_file);
        
        //如果目录不存在，则创建目录
        mkdir(filePath);
        fs.readFile( obj.req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if( err ){
                    console.log( err );
                }else{
                    response = {
                        state   : 1,
                        message : 'File uploaded successfully',
                        filename: fileName,
                        url     : obj.path + typeDir + fileName + '.' + contentType,
                    };
                }
                
                obj.res.end( JSON.stringify( response ) );
            });
        });
    };
}

module.exports = Model;