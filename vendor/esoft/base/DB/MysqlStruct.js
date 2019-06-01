function MysqlStruct(){
    //声明系统（用户自定义）函数名称,在后续判断中，
    //如果是函数名称的值将不加引号
    this.systemKey = ['NOW','COUNT','SUM'];

    this.struct ={
        where  : [],
        groupBy: [],
        orderBy: [],
        limit  : []
    };
    
    this.me = function(){
        console.log("this is MysqlStruct");
    }

    this.init = function(struct){
        //过滤不安全字符
        for(var i in struct){
            if(typeof struct[i] === 'function') continue;
            for(var k = 0; k < struct[i].length; k ++){
                if (typeof struct[i][k] === 'string') struct[i][k] = struct[i][k].replace(/[?]/g,'');
                if (typeof struct[i][k] === 'number') struct[i][k] = struct[i][k];
            }
        }
        this.struct = struct;
        
        return this;
    }

    /**
     * 默认以and 作为连接字符，如果指定delimiter为'or',则以'or'为连接字符
     * this.struct对象结构如：
        {
            where:[
                'field0 = value0',
                ...
            ],
            groupBy:[
                'field0',
                ...
            ],
            orderBy:[
                'field0',
                ...
            ],
            limit:[
                'start',
                'end'
            ]
        };
     */
    this.fields = function(){
        return (this.struct.fields && this.struct.fields.length > 0) ? " " + this.struct.fields.join(',') : "";
    }

    this.where = function(delimiter){
        delimiter = delimiter || ' and ';
        return (this.struct.where && this.struct.where.length > 0) ? " where " + this.struct.where.join(delimiter) : "";
    }

    this.having = function(delimiter){
        delimiter = delimiter || ' and ';
        return (this.struct.having && this.struct.having.length > 0) ? " having " + this.struct.having.join(delimiter) : "";
    }


    /**
     * group by 子查询
     */
    this.groupBy = function(){
        return (this.struct.groupBy && this.struct.groupBy.length > 0) ? " group by  " + this.struct.groupBy.join(" and ") : "";
    }

    /**
     * order by 子查询
     */
    this.orderBy = function(){
        return (this.struct.orderBy && this.struct.orderBy.length > 0) ? " order by " +  this.struct.orderBy.join(', ') : '';
    }
    
    /**
     * limit 子查询
     */
    this.limit = function(){
        return (this.struct.limit && this.struct.limit.length > 0) ? " limit " +  this.struct.limit.join(', ') : '';
    }

    /**
     * 构造insert 字段
     * this.struct对象结构如：
        [
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
        ];
     
     */
    this.insertNames = function(){
        var names  = "(`";
            names += Object.keys(this.struct[0]).toString() + '`)';
            names  = names.replace(/,/g,'`,`');
        return  names;
    }


    /**
     * 构造insert语句的values子句
     * 返回语句结构如：
     * this.struct对象结构如：
     * [
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
        ];
     * 
     */
    this.insertValues = function(){
        var values = '';
        for(var j = 0; j < this.struct.length; j++ ){
            var value   = '';
                values += ',(';
            for (var i in this.struct[j]) {
                if(typeof this.struct[j][i] === 'function') continue;
                value += this.sqlString(this.struct[j][i]) ?
                (",'" + this.struct[j][i] + "'"): 
                ("," + this.struct[j][i]);
            }
            value   = value.substr(1);
            values += value + ')';
        }
        return ' values ' + values.substr(1);

    }

    /**
     * 构造upload 语句的set子句
     * this.struct对象结构如：
     {
        feilds:{
            field1: value1,
            field2: value2,
            field3: value3,
            ...
        },
        where:[
            'field0 = value0',
            '...'
        ]
     }
     */
    this.updateFeilds = function(){
        var feilds = "";
        for(var i in this.struct.feilds){
            if(typeof this.struct.feilds[i] === 'function') continue;
            feilds += this.sqlString(this.struct.feilds[i]) ?
             ',`' + i + "` = '" + this.struct.feilds[i] + "'": 
             ',`' + i + "` = " + this.struct.feilds[i];
        }

        return feilds.substr(1);
    }


    /**
     * 检测对象在sql语句中是否应该以字符串的形式存在，如果是，则返回true,
     * 否则不回false
     */
    this.sqlString = function(checked){
        //判断数字类型
        if(typeof checked === 'number') return false;
        //判断布尔值类型
        if(typeof checked === 'boolean') return false;
        //判断空对象类型
        if(typeof checked === 'object') return false;
        //判断是否为函数名称
        for(var i = 0; i < this.systemKey.length; i ++){
            var sysKey = this.systemKey[i];
            if(checked.toString().toUpperCase().indexOf(sysKey) === 0) return false;
        }

        return true;
    }
}

module.exports = MysqlStruct;