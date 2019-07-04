function UploadsPlug(data){
    this._TEXT = function(wrap){
        return wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
    }
    
    this._TEXTJsVar = function(wrap){
        var code = wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
        return this.jsVar(code);
    }

    this._TEXTViewVar = function(wrap){
        var code = wrap.toString().match(/\/\*\s([\s\S]*)\s\*\//)[1];
        return this.viewVar(code);
    }

    /**
     * 为模块添加变量
     */
    this.jsVar = function(code){
        if(!data) return code;
        var addCode = "<script>var data = JSON.parse('" + JSON.stringify(data) + "');";
        return code.replace('<script>',addCode);
    }

    /**
     * 为模块添加变量
     */
    this.viewVar = function(code){
        if(!data) return code;
        for(var i in data){
            var pattern = '<% ' + i + ' %>';
            code = code.replace(pattern,data[i]);
        }
        //console.log(code);
        return code;
    }

    /**
     * 通用文件上传方式
     */
    this.normalAsync = this._TEXTJsVar(function(){/*
        <script>
            var uploading = false;
            $(data.control).on("change", function(){
                if(uploading){
                    alert("文件正在上传中，请稍候");
                    return false;
                }
                $.ajax({
                    url: data.url,
                    type: 'POST',
                    cache: false,
                    data: new FormData($(data.form)[0]),
                    processData: false,
                    contentType: false,
                    dataType:"json",
                    beforeSend: function(){
                        uploading = true;
                    },
                    success : function(data) {
                        console.log(data);
                        if (data.state == 1) {
                            (data.successCallback)(data);
                        } else {
                            (data.faileCallback)(data);
                        }
                        uploading = false;
                    }
                });
            });
        </script>
    */});




    /**
     * JqueryCropper图片异步上传方式方法组
     * 组成成员：this.cropperView、this.cropperAsync
     * JqueryCropper图片异步上传依赖jquery.js、cropper.min.css、ImgCropping.css、cropper.min.js
     * 调用方法：
     * 在控制器或模型中调用语法如下：
     * this.plug('Uploads',{
            accept: 'image/jpg,image/jpeg,image/png',  //在弹窗中可以选择的文件类型
            cropper_css: '/stylesheets/lib/cropper.min.css',
            imgCropping_css: '/stylesheets/lib/ImgCropping.css',
            cropper_js: '/javascripts/lib/cropper.min.js'
       }).cropperView;
     */
    this.cropperView = this._TEXTViewVar(function(){/*
        <!-- 图片上传样式 -->
        <link rel="stylesheet" href="<% cropper_css %>">
        <link rel="stylesheet" href="<% imgCropping_css %>">
        <script src="<% cropper_js %>"></script>

        <!-- 图片上传 -->
        <!--图片裁剪框 start-->
        <div style="display: none" class="tailoring-container">
            <div class="black-cloth" onclick="closeTailor(this)"></div>
            <div class="tailoring-content">
                <div class="tailoring-content-one">
                    <label title="上传图片" for="chooseImg" class="l-btn choose-btn">
                    <input type="file" accept="<% accept %>" name="file" id="chooseImg" class="hidden" onchange="selectImg(this)">
                    选择图片
                </label>
                    <div class="close-tailoring" onclick="closeTailor(this)">×</div>
                </div>
                <div class="tailoring-content-two">
                    <div class="tailoring-box-parcel">
                        <img id="tailoringImg">
                    </div>
                    <div class="preview-box-parcel">
                        <p>图片预览：</p>
                        <div class="square previewImg"></div>
                        <div class="circular previewImg"></div>
                    </div>
                </div>
                <div class="tailoring-content-three">
                    <button class="l-btn cropper-reset-btn">复位</button>
                    <button class="l-btn cropper-rotate-btn">向右旋转</button>
                    <button class="l-btn cropper-rotate-btn-left">向左旋转</button>
                    <button class="l-btn cropper-scaleX-btn">换向</button>
                    <button class="l-btn sureCut" id="sureCut">确定</button>
                </div>
            </div>
        </div>
        <!--图片裁剪框 end-->
    */});
    /**
     * 调用方法：
     * 在控制器或模型中调用语法如下：
     * this.plug('Uploads',{
                    aspectRatio: 1 / 1, //默认比例
                    viewMode: 2,
                    preview: '.previewImg', //预览视图
                    guides: false, //裁剪框的虚线(九宫格)
                    autoCropArea: 0.8, //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
                    movable: true, //是否允许移动图片
                    dragCrop: true, //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
                    movable: true, //是否允许移动剪裁框
                    resizable: true, //是否允许改变裁剪框的大小
                    zoomable: true, //是否允许缩放图片大小
                    mouseWheelZoom: true, //是否允许通过鼠标滚轮来缩放图片
                    touchDragZoom: true, //是否允许通过触摸移动来缩放图片
                    rotatable: true, //是否允许旋转图片
                    responsive: false,
                    crop: function(e) {
                        // 输出结果数据裁剪图像。
                    }
                }).cropperAsync;
     */
    this.cropperAsync = this._TEXTJsVar(function(){/*
        <script>
            //弹出框水平垂直居中
            (window.onresize = function() {
                var win_height = $(window).height();
                var win_width = $(window).width();
                
                if (win_width <= 768) {
                    $(".tailoring-content").css({
                        "top ": (win_height - $(".tailoring-content").outerHeight()) / 2,
                        "left ": 0
                    });  
                } else {
                    var top = (win_height - $(".tailoring-content").outerHeight())/2;
                    var left = (win_width - $(".tailoring-content").outerWidth())/2;

                    $(".tailoring-content").css({
                        "top":top,
                        "left": left
                    });
                }
            })();

            //参数设置项
            var option = {
                aspectRatio: data.aspectRatio, //默认比例
                viewMode: data.viewMode,
                preview: data.preview, //预览视图
                guides: data.guides, //裁剪框的虚线(九宫格)
                autoCropArea: data.autoCropArea, //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
                movable: data.movable, //是否允许移动图片
                dragCrop: data.dragCrop, //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
                movable: data.movable, //是否允许移动剪裁框
                resizable: data.resizable, //是否允许改变裁剪框的大小
                zoomable: data.zoomable, //是否允许缩放图片大小
                mouseWheelZoom: data.mouseWheelZoom, //是否允许通过鼠标滚轮来缩放图片
                touchDragZoom: data.touchDragZoom, //是否允许通过触摸移动来缩放图片
                rotatable: data.rotatable, //是否允许旋转图片
                responsive: data.responsive,
                crop: function(e) {
                    // 输出结果数据裁剪图像。
                },
                url: data.url,
            }

            //弹出图片裁剪框
            $("#replaceImg").on("click", function() {
                $(".tailoring-container").toggle();
                //$('#chooseImg').click();
                $('#tailoringImg').cropper('destroy');

                //cropper图片裁剪
                $('#tailoringImg').cropper(option);
            });

            //图像上传
            function selectImg(file) {
                if (!file.files || !file.files[0]) {
                    return;
                }
                var reader = new FileReader();
                reader.onload = function(evt) {
                    var replaceSrc = evt.target.result;
                    //更换cropper的图片
                    $('#tailoringImg').cropper('replace', replaceSrc, false); //默认false，适应高度，不失真
                }
                reader.readAsDataURL(file.files[0]);
            }
            
            //旋转
            $(".cropper-rotate-btn").on("click", function() {
                $('#tailoringImg').cropper("rotate", 15);
            });
            $(".cropper-rotate-btn-left").on("click", function() {
                $('#tailoringImg').cropper("rotate", -15);
            });
            //复位
            $(".cropper-reset-btn").on("click", function() {
                $('#tailoringImg').cropper("reset");
            });
            //换向
            var flagX = true;
            $(".cropper-scaleX-btn").on("click", function() {
                if (flagX) {
                    $('#tailoringImg').cropper("scaleX", -1);
                    flagX = false;
                } else {
                    $('#tailoringImg').cropper("scaleX", 1);
                    flagX = true;
                }
                flagX != flagX;
            });

            var i = $('.finalImg').children().length;
            var j =[];
            var finalImg = $('.finalImg').find('img');
            for(var q = 0; q < finalImg.length; q++){
                j.push(finalImg.eq(q).attr('id'));
            }
            
            //裁剪后的处理
            $("#sureCut").on("click", function() {
                if ($("#tailoringImg").attr("src") == null) {
                    return false;
                } else {
                    var cas = $('#tailoringImg').cropper('getCroppedCanvas'); //获取被裁剪后的canvas
                    var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
                    
                    if (j.length < 5) {
                        $('.finalImg').append('<div class="col " style="display:table;float:left; " ><img src="/static/images/default-pic.jpg " id="finalImg'+i+'"  width="150" style="margin-left:10px;margin-top:5px;" /><em class="close " title="删除这张图片" onclick="deleteImage(this) ">×</em></div>');
                        $("#finalImg" + i).prop("src", base64url); //显示为图片的形式
                        j.push('finalImg' + i);

                        cas.toBlob(function(blob){
                            //console.log(blob)
                            var formData = new FormData();
                            formData.append('image', blob);
                            $.ajax({
                                url:option.url,
                                type: "post",
                                cache: false,
                                data:formData,
                                contentType: false,
                                processData: false,
                                success:function(res){
                                    res = JSON.parse(res);
                                    //上传成功
                                    //console.log(res);
                                    if(res.state == 1){
                                        console.log(res);
                                        upProcess(res);
                                        //$('form[name="edit"]').append('<input type="hidden" data-type="icon" id="iconfinalImg'+(i-1)+'" name="icon'+ (i-1) +'" value="' + res.data + '"/>');
                                    }
                                    //上传失败
                                    else{
                                        alert('上传失败，请重新上传！');
                                    }
                                }
                            });
                        });
                        i++;
                    } else {
                        alert("只允许上传5张图片 ");
                        $(".tailoring-container").toggle();
                        //$('#tailoringImg').cropper('destroy');
                        closeTailor();
                    }
                    
                    //关闭裁剪框
                    closeTailor();
                }
            });
            //关闭裁剪框
            function closeTailor() {
                $(".tailoring-container").toggle();
                //$('#tailoringImg').cropper('destroy');
            }

            //删除图片
            function deleteImage(e) {
                var val = $(e).siblings('img').attr('id');
                console.log(val)
                delectImage2data(val);
                for (var i = 0; i < j.length; i++) {
                    if (j[i] == val) {
                        j.splice(i, 1);
                        break;
                    }
                }
                
                $(e).parent('.col').remove();
            }
        </script>
    */});

    
}

module.exports = UploadsPlug;