var fs = require('fs');
var path = require('path');

//循环创建多层目录
global.mkdir = function(dirPath){
    if(fs.existsSync(dirPath)) return;
    if(!fs.existsSync(path.dirname(dirPath))){
        mkdir(path.dirname(dirPath));
    }
    fs.mkdirSync(dirPath)
}