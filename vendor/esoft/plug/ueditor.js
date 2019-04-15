var ueditor = {
    _TEXT: function(wrap){
        return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
    },

    /**
     * 初始始化ueditor，该方法在app.use中被引用
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    init: function(req, res, next){
        //客户端上传文件设置
        var imgDir = '/img/ueditor/';
        var ActionType = req.query.action;
        if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
            var file_url = imgDir;//默认图片上传地址
            /*其他上传格式的地址*/
            if (ActionType === 'uploadfile') {
                file_url = '/file/ueditor/'; //附件
            }
            if (ActionType === 'uploadvideo') {
                file_url = '/video/ueditor/'; //视频
            }
            
            res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
            res.setHeader('Content-Type', 'text/html');
        }
        //  客户端发起图片列表请求
        else if (req.query.action === 'listimage') {
            var dir_url = imgDir;
            res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
        }
        // 客户端发起其它请求
        else {
            // console.log('config.json')
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/ueditor/nodejs/config.json');
        }
    },

    

    /**
     * 输出ueditor客户端api
     */
    ueditorAPI: function(){
        return this._TEXT(function(){/*
        <script type="text/javascript">
            //实例化编辑器
            //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
            
            function UEditor(tag){
                return new UE.getEditor(tag);
            }
            function isFocus(e){
                alert(UE.getEditor('editor').isFocus());
                UE.dom.domUtils.preventDefault(e)
            }
            function setblur(e){
                UE.getEditor('editor').blur();
                UE.dom.domUtils.preventDefault(e)
            }
            function insertHtml() {
                var value = prompt('插入html代码', '');
                UE.getEditor('editor').execCommand('insertHtml', value)
            }
            function createEditor() {
                enableBtn();
                UE.getEditor('editor');
            }
            function getAllHtml() {
                alert(UE.getEditor('editor').getAllHtml())
            }
            function getContent() {
                var arr = [];
                arr.push("使用editor.getContent()方法可以获得编辑器的内容");
                arr.push("内容为：");
                arr.push(UE.getEditor('editor').getContent());
                alert(arr.join("\n"));
            }
            function getPlainTxt() {
                var arr = [];
                arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
                arr.push("内容为：");
                arr.push(UE.getEditor('editor').getPlainTxt());
                alert(arr.join('\n'))
            }
            function setContent(isAppendTo) {
                var arr = [];
                arr.push("使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容");
                UE.getEditor('editor').setContent('欢迎使用ueditor', isAppendTo);
                alert(arr.join("\n"));
            }
            function setDisabled() {
                UE.getEditor('editor').setDisabled('fullscreen');
                disableBtn("enable");
            }

            function setEnabled() {
                UE.getEditor('editor').setEnabled();
                enableBtn();
            }

            function getText() {
                //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
                var range = UE.getEditor('editor').selection.getRange();
                range.select();
                var txt = UE.getEditor('editor').selection.getText();
                alert(txt)
            }

            function getContentTxt() {
                var arr = [];
                arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
                arr.push("编辑器的纯文本内容为：");
                arr.push(UE.getEditor('editor').getContentTxt());
                alert(arr.join("\n"));
            }
            function hasContent() {
                var arr = [];
                arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
                arr.push("判断结果为：");
                arr.push(UE.getEditor('editor').hasContents());
                alert(arr.join("\n"));
            }
            function setFocus() {
                UE.getEditor('editor').focus();
            }
            function deleteEditor() {
                disableBtn();
                UE.getEditor('editor').destroy();
            }
            function disableBtn(str) {
                var div = document.getElementById('btns');
                var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
                for (var i = 0, btn; btn = btns[i++];) {
                    if (btn.id == str) {
                        UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
                    } else {
                        btn.setAttribute("disabled", "true");
                    }
                }
            }
            function enableBtn() {
                var div = document.getElementById('btns');
                var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
                for (var i = 0, btn; btn = btns[i++];) {
                    UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
                }
            }
        </script>
        */});
    },

}

module.exports = ueditor;
