/**
 * 自定义使用布局文件的规则
 */
global.setLayer = function(data){
	if(data[1] === 'admin') return 'main0';
	if(data[1] === 'sign') return 'main_sign';
	if(data[1] === 'cms') return 'main_cms';
	return 'main';
}