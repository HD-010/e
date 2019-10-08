var Regexp = require('../lib/Regexp');
/**
 * 使用场景：可以在controler,model,service中调用，以获取传入的参数值
 * 调用方法：
 * 方式一，以安全字符模式获取传入的参数值
 * this.GET('param') 
 * 方式二，以非安全字符模式获取传入的参数值,该模式下不会过滤数据中的特殊字符
 * this.GET('!param')
 * 方式三，当param不存在时会返回undefind,如果设有default，则返回value
 *        当param存在，但没有值，会返回空值,如果设有default,并且不受default的影响
 * this.GET('param',{default:value})
 * 方式四,当设有reg参数时，会对原参数值进行正则匹配。‘number’为匹配模式的名称，
 * 可以在esoft/lib/Regexp.js查看。如果匹配正确则返回传入的参数值；如查匹配不正确，
 * 则返回默认值value。
 * this.GET('param',{default:value,reg:'number'})
 * 方式四，为方式三的匹配模式取返
 * this.GET('param',{default:value,reg:'!number'})
 * 
 * this.POST()、this.REQUEST()和this.GET()用法相同
 * @param {*} req 
 */
function Request(req){
    this.req          = req;
    this.fill         = 1;
    this.pattern      = 0;
    this.param        = '';
    this.exten        = '';
    this.defaultValue = null;
    this.body         = req.body;
    this.query        = req.query;
    this.data         = {};
    
    this.init = function(param,objExten){
        //参数为空
        //if(!param) return;
       
        //启用非安全字符(默认过滤特殊字符，启用非安全字符模式后不过滤)
        if(param.indexOf('!') != -1) {
            this.fill  = 0;
            this.param = param.substr(1);
        }
        //启用安全字符
        else{
            this.fill  = 1;
            this.param = param;
        }
        
        //设置匹配模式,默认不启用匹配和默认值
        if(typeof objExten == 'object'){
            this.exten = objExten;

            this.pattern = ('reg' in objExten) ? objExten.reg : 0;

            if('default' in objExten) this.defaultValue = objExten.default;
        }
    };

    this.processData = function(){
        //处理参数对应的数据
        switch(this.data.err){
            case 0: 
                if(this.fill && (typeof this.data.data === 'string')) this.data.data = Regexp.specialHTML(this.data.data);
            
                if(this.pattern && this.pattern.indexOf('!') == -1) {
                    this.data.data = Regexp.match(this.data.data, this.pattern) ? this.data.data : this.defaultValue;
                }else
                if(this.pattern && this.pattern.indexOf('!') != -1){
                    this.data.data = Regexp.match(this.data.data, this.pattern.substr(1)) ? this.defaultValue : this.data.data;
                }
                break;
            case 1: 
            case 2: 
                //输出错误信息
                console.log(this.data.infor);
                //返回数据
                if(typeof this.exten == 'object') this.data.data = this.defaultValue;
                break;
            default: 
        }
    }

    /**
     * 获取post或get请求的参数
     * param string 请求的参数名称
     * objExten Object 对请求的参数值进行处理的描述对象
     * 返回处理后的请求数据
     */
    this.REQUEST = function(param,objExten){
        this.init(param,objExten);
        this.processPOST(this.param,objExten);

        switch(this.data.err){
            case -1: 
                this.processGET(objExten);
                var data     = {};
                    data.get = this.data.data;
                this.processPOST(objExten);
                data.post = this.data.data;
                this.data = data;
                break;
            case 2: 
                this.processGET(objExten);
                this.processData();
                break;
                default: 
        }
        
        return this.data.data;
    };  

    /**
     * 获取post请求的参数
     * param string 请求的参数名称
     * objExten Object 对请求的参数值进行处理的描述对象
     * 返回处理后的请求数据
     */
    this.POST = function(param,objExten){
        if(!param) return this.body;
        this.init(param,objExten);
        this.processPOST(objExten);
        this.processData();
        return this.data.data;
    };

    /**
     * 获取get请求的参数
     * param string 请求的参数名称
     * objExten Object 对请求的参数值进行处理的描述对象
     * 返回处理后的请求数据
     */
    this.GET = function (param,objExten){
        if(!param) return this.query;
        this.init(param,objExten);
        this.processGET(objExten);
        this.processData();
        return this.data.data;
    };
    
    /**
     * 返回路由格式的参数（该方法用于业务调用）
     */
    this.param = function(router,paramName){
        if(!router.params) router.params = '';
        params = router.params.split('/');
        var index = params.indexOf(paramName);
        
        return (index != -1) ? params[index + 1] : undefined;
    }
    
    this.processPOST = function(objExten){
        var err = {};
        if(typeof this.param != 'string'){
            err = {err:1,infor:'请求参数应该是字符串'};
        }
        else if(!this.param.length){
            err = {err:-1,infor:'',data:this.body};
        }
        else if(this.param in this.body){
            err = {err:0,infor:'',data:this.body[this.param]};
        }else{
            err = {err:2,infor:'客户端请求中没有"'+this.param+'"参数'};
        }
        
        this.data = err;
    };

    this.processGET = function(objExten){
        //console.log('GET');
        var err = {};
        if(typeof this.param != 'string'){
            err = {err:1,infor:'请求参数应该是字符串'};
        }
        else if(!this.param.length){
            err = {err:-1,infor:'',data:this.query};
        }
        else if(this.param in this.query){
            err = {err:0,infor:'',data:this.query[this.param]};
        }else{
            err = {err:2,infor:'客户端请求中没有"'+this.param+'"参数'};
        }
        
        this.data = err;
    };

    //处理返回数据
    this.value = function(obj, value) {

        //正则过滤
        if ((value != undefined) && ('reg' in obj)) {
            value = this.ruler(value, obj.reg) ? value : obj.default;
        }
        
        return value;
    };

    //验证则
    this.ruler = function(value, reg) {
        if(!value.length) return '';
        return Regexp.match(value, reg) || '';
    };

}

module.exports = Request;