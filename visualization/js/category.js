/**
 * 生成图表列表
 */
function createShowing(){
    $.ajax({
        url:SERVER_URL+"/visualization/visualization/selectVisualizationMenu",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {},    //参数值
        type: "post",   //请求方式
        success: function (result) {
            var json = eval(result);
            dataarr= json.visualizationInfos;
            var img="";
            for(var i=0;i<json.visualizationInfos.length ;i++){
                var div="";
                var name="";
                var permissions=json.visualizationInfos[i].permissions;
                if(json.usercode==json.visualizationInfos[i].recordercode){
                    permissions='1';
                }
                if(json.visualizationInfos[i].name==null||json.visualizationInfos[i].name==''){
                    name=$.i18n.prop('chart');
                }else{
                    name=json.visualizationInfos[i].name;
                }
                if(json.visualizationInfos[i].classificationtype=="1"){
                    img="img/category.png";
                    if(permissions=='1'){
                        div= "<li> <a href=\"showtest.html?classificationid="+json.visualizationInfos[i].visualizationid+"\" title=\""+$.i18n.prop('view')+"\"><i class=\"fa fa-folder-open-o\"></i></a></li>"+
                            "<li> <a href=\"#\" title=\""+$.i18n.prop('delete')+"\"><i class=\"fa fa-trash-o\" data-toggle=\"modal\" data-id="+json.visualizationInfos[i].visualizationid +"  data-toggle=\"modal\" data-type=\"1\"  data-target=\"#delete\"></i></a></li></ul></div>"+
                            "\t\t\t\t\t\t\t</div>\n</div>";
                    }else{
                        div= "<li> <a href=\"showtest.html?classificationid="+json.visualizationInfos[i].visualizationid+"\"><i class=\"fa fa-folder-open-o\"></i></a></li></ul></div>"+
                            "\t\t\t\t\t\t\t</div>\n</div>";
                    }
                }else{
                    //$.base64.atob()
                    img=$.base64.atob(json.visualizationInfos[i].img);
                    if(permissions=='1'){
                        div="<li> <a href=\"#\" title=\""+$.i18n.prop('chartview')+"\"><i class=\"fa fa-image\" data-toggle=\"modal\" data-target=\"#addCategory\" data-id="+json.visualizationInfos[i].visualizationid +"  data-num="+i+"></i></a></li>"+
                            "<li> <a href=\"#\" title=\""+$.i18n.prop('permissionlist')+"\"><i class=\"fa fa-users\" onclick=\"toPermission("+json.visualizationInfos[i].visualizationid+")\"></i></a>"+
                            "<li> <a href=\"#\" title=\""+$.i18n.prop('delete')+"\"><i class=\"fa fa-trash-o\" data-id="+json.visualizationInfos[i].visualizationid +"  data-toggle=\"modal\" data-type=\"0\" data-target=\"#delete\"></i></a></li></ul></div>"+
                            "\t\t\t\t\t\t\t</div>\n</div>";
                    }else{
                        div= "<li> <a href=\"#\"><i class=\"fa fa-image\" data-toggle=\"modal\" data-target=\"#addCategory\" data-id="+json.visualizationInfos[i].visualizationid +"  data-num="+i+"></i></a></li>"+
                            "</ul></div>\t\t\t\t\t\t\t</div>\n</div>";
                    }
                }
                $("#result").append("<div class=\"col-xs-3\">\n" +
                    "\t\t\t\t\t\t<div class=\"panel panel-info\">\n" +
                    "\t\t\t\t\t\t\t<div  class=\"panel-heading\" style=\" background:transparent;\" >\n" +
                    "\t\t\t\t\t\t\t\t<h3 class=\"panel-title\">"+name+"</h3>\n" +
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t<div class=\"panel-body\" align=\"center\">\n" +
                    "<div class=\"box\">\t\t\t\t\t\t\t\t<img src="+img+">\n" +
                    "<div class=\"box-content\"><ul class=\"icon\">"+
                    div+
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t</div>");
            }
        },
        complete: function () {

        },
        error: function (result) {
            console.info(result);
        }
    });
}


function toPermission(visualizationid) {
    parent.layer.open({
        type: 2,
        title: $.i18n.prop('permissionlist'),
        area: ['1100px', '95%'],
        shade: 0.8,
        closeBtn: 1,
        shadeClose: true,
        content: SERVER_URL+'/visualization/permission.html?visualizationid='+visualizationid,
    });
}

/**
 * 查看（图表）按钮的模态框传值
 */
$('#addCategory').on('show.bs.modal',function (event) {
    var button = $(event.relatedTarget);
    var dataid = button.data('id');
    //找出查看的是第几个图表
    var num = "";
    var num = button.data("num");

    var htmlStr= "";
    //先将查看图表模态框置空
    $("#addCategory").html("");


    htmlStr = "<div class=\"modal-dialog\" style=\"width: 90%;height: 100%;\">";
    htmlStr = htmlStr+ "<div class=\"modal-content\" style=\"width: 100%;height: 100%;\" align=\"center\">";
    htmlStr= htmlStr + "<div class=\"modal-header\">\n" +
        "\t\t\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
        "\t\t\t\t\t\t<h4 class=\"modal-title\" id=\"myModalLabel\">"+$.i18n.prop('chartview')+"</h4>\n" +
        "\t\t\t\t\t</div>";
    htmlStr = htmlStr +"<div class=\"modal-body\" style=\"height: 100%;\">\n" +
        "\t\t\t\t\t\t<iframe id=\"iframe\" src=\"visualization.html?visualizationid="+dataid+"&classificationid="+classificationid+"&type="+dataarr[num].type+"\" scrolling=\"yes\" frameborder=\"0\" style=\"width: 100%;height: 90%;\"></iframe>\n" +
        "\t\t\t\t\t</div>";
    htmlStr = htmlStr + "</div></div>";

    $("#addCategory").append(htmlStr);


});
/**
 * 为编辑分类图片的拟态框传值
 */
$('#editCategory').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var recipient = button.data('whatever');
    var dataid = button.data('id');
    var modal = $(this);
    modal.find('#name').val(recipient);
    sessionStorage["dataid"]=dataid;
});
/**
 * 编辑分类的图片（没有用到）
 * @param ctrlName
 */
function initFileInput1(ctrlName) {
    var control = $('#' + ctrlName);
    control.fileinput({
        language: 'zh',
        uploadUrl:SERVER_URL+ "/visualization/visualization/uploadImg",
        showUpload: false,
        showPreview: false,
        autoReplace: true,
        maxFileCount: 1,
        allowedFileExtensions: ["jpg", "png", "gif"],
        browseClass: "btn btn-primary", //按钮样式
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        layoutTemplates: {
            actionDelete: '',
            actionUpload: '',
        }
    }).on("filepreupload", function(event, data, msg) {

    }).on("fileuploaded", function(event, outData) {
        var form = document.getElementById('editCategory');
        var img=outData.jqXHR.responseJSON.savePath;
        var tagElements = form.getElementsByTagName('input');
        var value=tagElements[0].value;
        if(value==''||value==undefined||value==null){
            alert("请填写分类名称");
            return;
        }else{
            $.ajax({
                url: SERVER_URL+'/visualization/visualization/saveClassification', // 跳转到 action
                data: {
                    "classificationInfo.img":img,"classificationInfo.name":value,"classificationInfo.classificationid":sessionStorage.dataid
                },
                type: 'post',
                cache: false,
                async: true,
                dataType: 'json',
                timeout: 60000,
                success: function(data) {
                    $('#editCategory').modal('hide');
                    freshen();
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });

        }
    }).on('filebatchuploaderror', function(event, data, msg) { //一个文件上传失败
    });
}
function  exportImage(id){
    window.location.href="/visualization/showtest.html?classificationid="+id;
}