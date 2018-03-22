/**
 * @生成报表列表
 */
function createReport() {
    $.ajax({
        url : SERVER_URL + "/visualization/report/selectVisualizationreportInfosByCond",
        dataType : "json",
        async : true,
        data : {},
        type : "post",
        success : function(result) {
            var json = eval(result);
            dataarr = json.visualizationreportInfos;
            for (var i = 0; i < json.visualizationreportInfos.length; i++) {
                var div = "";
                var reportname = "";
                var reporturl = json.visualizationreportInfos[i].reporturl;
                if (json.visualizationreportInfos[i].reportname == null || json.visualizationreportInfos[i].reportname == '') {
                    reportname = $.i18n.prop('report');
                } else {
                    reportname = json.visualizationreportInfos[i].reportname;
                }
                var permissions=json.visualizationreportInfos[i].permissions;
                if(json.usercode==json.visualizationreportInfos[i].recordercode){
                    permissions='2';
                }
                if(permissions=='2'){
                    div="<li> <a href=\"#\" title=\""+$.i18n.prop('delete')+"\"><i class=\"fa fa-trash-o\" data-toggle=\"modal\" data-id="+json.visualizationreportInfos[i].reportid +"  data-toggle=\"modal\" data-type=\"2\"  data-target=\"#delete\"></i></a></li></ul></div>";
                }
                $("#result").append(
                    "<div class=\"col-xs-3\">\n" +
                    "\t\t\t\t\t\t<div class=\"panel panel-info\">\n" +
                    "\t\t\t\t\t\t\t<div  class=\"panel-heading\" style=\" background:transparent;\" >\n" +
                    "\t\t\t\t\t\t\t\t<h3 class=\"panel-title\">"+reportname+"</h3>\n" +
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t<div class=\"panel-body\" align=\"center\">\n" +
                    "<div class=\"box\">\t\t\t\t\t\t\t\t<img src="+$.base64.atob(json.visualizationreportInfos[i].reporturl)+">\n" +
                    "<div class=\"box-content\"><ul class=\"icon\"><li>"+
                    "<li> <a href=\"dashboard.html?reportid= "+json.visualizationreportInfos[i].reportid+"&reportname="+encodeURI(encodeURI(json.visualizationreportInfos[i].reportname))+"&permissions="+permissions+"\" title=\""+$.i18n.prop('view')+"\"><i class=\"fa fa-image\"></i></a></li>"+
                    div+
                    "\t\t\t\t\t\t\t</div>\n</div>"+
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t</div>");
            }
        },
        error : function() {}
    });
}
