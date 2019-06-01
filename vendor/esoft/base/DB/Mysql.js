/**
 * 说明：该类实例化为DBservice的一个属性。
 * 可以通过this.app.dBService.init(DBName)进行实例化。也可以在controler,model,service中调用Common的方法：this.DB()进行实例化。
 * 该类提供五个对外访问的方法:select(),insert(),update(),delect()及log();
 * 调用前四个方法，分别执行相应的操作。如果需要输出查询记录，调用log()方法即可（语法：this.DB().log().select(sql,callback)）。
 */
function Mysql(){
    this.configures = {};
    this.connection = {};
    this.results = {};
    this.withLog = 0;
    this.schema = {};
    
    this.init = function(){
        var mysqlObj = new Mysql();
        var mysql = require('mysql');
        mysqlObj.connection = mysql.createPool(this.configures.Mysql);
        
        return mysqlObj;
    }

    this.log = function(){
        this.withLog = 1;
        return this;
    }

    this.putOutDone = function(){
        this.withLog = 0;
    }

    this.select = this.insert = this.update = this.delete = this.query = function(sql,callback){
        var that = this;
        that.connection.getConnection(function(error,connection){
            if(error) throw(error);
            connection.query(sql,function(error,results,fields){
                connection.destroy(); 
                if(error) throw(error);
                if(that.withLog){
                    var action = sql.substr(0,sql.indexOf(' ')).trim() + 'Log';
                    if(action  in that) that[action](error || results);
                }
                callback(error,results,fields);
            });
        });
    }

    //初始化sql构造对象
    this.initSqlStruct = function(params){
        return  (new (require('./DB/MysqlStruct'))()).init(params);
    }

    /**
     * 默认以and 作为连接字符，如果指定delimiter为'or',则以'or'为连接字符
     * this.struct对象结构如：
        params = {
            table:[],           //查询的表名
            join:'',
            fields:[],          //被查询的字段名称（别名在此指定）
            where:[],           //查询条件
            having:[],          //查询条件
            groupBy:[],         //分组条件
            orderBy:[],
            limit:[]
        };
     */
    this.get = function(params,callback){
        var sqlStruct = this.initSqlStruct(params);
        var joinOn = params.joinOn ? params.joinOn : '';
        sql = 'select ' + 
        sqlStruct.fields() +
        ' from ' + 
        params.table[0] + 
        joinOn + 
        sqlStruct.where() + 
        sqlStruct.having() + 
        sqlStruct.groupBy() + 
        sqlStruct.orderBy() + 
        sqlStruct.limit();
        log(sql)
        
        this.select(sql,function(error,results,fields){
            callback(error,results,fields);
        });
    }

    /**
     * 保存数据到表：方法用于修改记录，增加记录或增加字段并增加或修改记录
     * params= {
     *      table:'',
            where:[
                'grade = 10',
                //在这里写更多条件
            ],
            fields:[
            //待写入的第一组数据
                {
                    grade: this.POST('grade',{default:10}),
                    losal: this.GET('losal',{default:1500}),
                    hisal: this.POST('hisal') || 2500,
                },
                //待写入的第二组数据
                {
                    grade: this.POST('grade',{default:10}),
                    losal: this.GET('losal',{default:1600}),
                    hisal: this.POST('hisal') || 2600,
                }
            ]
        }
     */
    this.set = function(params,callback){
        var that = this;
        var table = params.table;
        var schema;
        
        params.table = [table];
        try{
            schema = dbSchema[table];
            addFields(set);
        }catch(err){
            initSchema(table,set);
        }
        
        /**
         * 保存字段对应的数据
         */
        function set(){
            if(!params.where || !params.where.length) params.where = ["id='#'"];        //当没有传where参数时，默认新增记录
            that.get(params,function(error,results,fields){
                if(error) throw('错误：保存数据失败，调取源数据失败');
                params.table = table;
    
                if(results.length){
                    for(var i = 0; i < results.length; i ++){
                        results[i] = mergeObj([results[i],params.fields[0]])
                    }
                    params.fields = results;
    
                    that.del(params,function(error,results,fields){
                        if(error) throw("错误：删除源数据失败");
                        that.add(params,function(error,results,fields){
                            callback(error,results,fields);
                        });
                    })
                }else{
                    that.add(params,function(error,results,fields){
                        callback(error,results,fields);
                    });
                }
            })
        }

        /**
         * 初始化表结构
         * @param {*} tableName 
         * @param {*} callback 
         */
        function initSchema(tableName,callback){
            var params = {
                table:['information_schema.COLUMNS'],
                where:[
                    ' table_name = "'+ tableName +'" ',
                ],
            }
            
            that.get(params,function(error,results,fields){
                if(error) throw('错误：调取表结构失败');
                if(!results.length) throw('错误：数据表'+ table + '不存在');
                try{
                    dbSchema[table] = results;
                }catch(err){
                    global.dbSchema = [];
                    dbSchema[table]= results;
                    
                    //判断保存数据对应的字段是不是存在，如果不存在，则动态增加
                    addFields(set)
                }
            });
        }

        /**
         * 判断保存数据对应的字段是不是存在，如果不存在，则动态增加
         * @param {*} callback 
         */
        function addFields(callback){
            if(params.fields){
                var fields = params.fields;
                var field,addonSql,beAddFields = '';
                var morfields = 0;
                var schema = queryresultKeyValue(dbSchema[table],'COLUMN_NAME');
                var addonAttr = {
                    string : 'varchar(255)',
                    number : 'float(11)',
                    boolean: 'varchar(255)'
                }
                for(var i = 0; i < fields.length; i ++){
                    field = fields[i];
                    for(var k in field){
                        if(schema.indexOf(k) === -1){
                            morfields = 1;
                            log("创建"+k+"字段")
                            //组织被添加的字段名称和数据类型
                            beAddFields += ' ,' + k + ' ' +addonAttr[typeof(field[k])] 
                        }
                    }
                }
                if(!morfields) return callback();
                //如：alter table ranyun_test add (sex float(11) ,cash float(11))
                addonSql = 'alter table ' + table  + ' add (' + beAddFields.substr(2) + ')';
                that.query(addonSql,callback);
            }
        }
    }



    /**
     * 删除表记录
     * params= {
     *      table:'',
            where:[
                'grade = 10',
                //在这里写更多条件
            ]
        }
     */
    this.del = function(params,callback){
        var sqlStruct = this.initSqlStruct(params);
        var sql = 'delete from ' + params.table + ' ' + sqlStruct.where();
        this.delete(sql,function(error,results,fields){
            callback(error,results,fields);
        });
    }

    /**
     * 增加表记录
     *  params = {
            table : '',
            fields:[
            //待写入的第一组数据
                {
                    grade: this.POST('grade',{default:10}),
                    losal: this.GET('losal',{default:1500}),
                    hisal: this.POST('hisal') || 2500,
                },
                //待写入的第二组数据
                {
                    grade: this.POST('grade',{default:10}),
                    losal: this.GET('losal',{default:1600}),
                    hisal: this.POST('hisal') || 2600,
                }
            ]
        };
     */
    this.add = function(params,callback){
        var sqlStruct = this.initSqlStruct(params.fields);
        var sql = 'insert into ' + params.table + ' ' + 
        sqlStruct.insertNames() +
        sqlStruct.insertValues();
        
        this.select(sql,function(error,results,fields){
            callback(error,results,fields);
        });
    }

    

    

    this.selectLog = function(result){
        console.log('--------------------------SELECT----------------------------');
        console.log(result);        
        console.log('------------------------------------------------------------\n\n');
        this.putOutDone();
    }

    this.insertLog = function(result){
        console.log('--------------------------INSERT----------------------------');
        console.log('INSERT ID:',result);        
        console.log('-------------------------------------------------------------\n\n');
        this.putOutDone();
    }

    this.updateLog = function(result){
        console.log('--------------------------DELETE----------------------------');
       console.log('UPDATE affectedRows',result.affectedRows);
       console.log('--------------------------------------------------------------\n\n');  
       this.putOutDone();
    }

    this.deleteLog = function(result){
        console.log('--------------------------DELETE----------------------------');
       console.log('DELETE affectedRows',result.affectedRows);
       console.log('--------------------------------------------------------------\n\n');  
       this.putOutDone();
    }
}

module.exports = Mysql;