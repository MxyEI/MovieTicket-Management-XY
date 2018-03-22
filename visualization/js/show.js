/**
 * 生成列表
 */
function getJsonData(){
    $.ajax({
            url: SERVER_URL+"/visualization/visualization/selectVisualizationInfos",
            type: "post",
            dataType:"json",
            data:{'cond.classificationid':classificationid},
            success: function(data){
                dataarr = data.visualizationInfos;
                createShowing(data);
            },
            error: function()
            {
            }
        }
    );
}
/**
 * 生成详细列表
 */
function createShowing(data){
    //获取后台传过来的jsonData,并进行解析
    var dataArray = data.visualizationInfos;

    var tableStr = "";

    var len = dataArray.length;
    var title="";
    var img="";
    //图表缩略图模版
    for(var i=0 ;i<len ; i++){
        tableStr = "";
        var div="";
        tableStr = tableStr + "<div class=\"col-xs-3\">";
        if(dataArray[i].title==''||dataArray[i].title==null||dataArray[i].title==undefined){
            title=$.i18n.prop('chart');
        }else{
            title=dataArray[i].title;
        }
        if(dataArray[i].type=='pie'){
            img="img/pie.png";
        }else{
            img=$.base64.atob(dataArray[i].img);
        }
        var permissions=dataArray[i].permissions;
        if(data.usercode==dataArray[i].recordercode){
            permissions='1';
        }
        if(permissions=='1'){
            div="<li> <a href=\"#\" title=\""+$.i18n.prop('view')+"\"><i class=\"fa fa-image\" data-toggle=\"modal\" data-target=\"#addCategory\" data-id="+dataArray[i].visualizationid +"  data-num="+i+"></i></a></li>"+
                "<li> <a href=\"#\"  title=\""+$.i18n.prop('permissionlist')+"\"><i class=\"fa fa-users\" onclick=\"toPermission("+dataArray[i].visualizationid+")\"></i></a>"+
                "<li> <a href=\"#\" title=\""+$.i18n.prop('delete')+"\"><i class=\"fa fa-trash-o\" data-id="+dataArray[i].visualizationid +"  data-toggle=\"modal\" data-type=\"0\" data-target=\"#delete\"></i></a></li></ul></div>"+
                "\t\t\t\t\t\t\t</div>\n</div>";
        }else{
            div= "<li> <a href=\"#\" title=\""+$.i18n.prop('view')+"\"><i class=\"fa fa-image\" data-toggle=\"modal\" data-target=\"#addCategory\" data-id="+dataArray[i].visualizationid +"  data-num="+i+"></i></a></li>"+
                "</ul></div>\t\t\t\t\t\t\t</div>\n</div>";
        }
        tableStr = tableStr + "<div class=\"panel panel-info\">\n" +
            "\t\t\t\t\t\t\t<div class=\"panel-heading\" style=\" background:transparent;\">";

        tableStr = tableStr + "<h3 class=\"panel-title\">"+ title +"</h3>"+"</div>";
        tableStr = tableStr + "<div class=\"panel-body\" align=\"center\">\n" +
            "<div class=\"box\">\t\t\t\t\t\t\t\t<img src="+img+">\n" +
            "<div class=\"box-content\"><ul class=\"icon\">"+
            div+
            "\t\t\t\t\t\t\t</div>\n"+
            "\t\t\t\t\t\t\t</div>\n" +
            "\t\t\t\t\t\t</div>";
        tableStr = tableStr + "</div>";

        $("#tubiaoshow").append(tableStr);
    }
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