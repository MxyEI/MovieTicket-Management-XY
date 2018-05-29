// var SERVER_URL = getRootPath();
var SERVER_URL = 'http://localhost:8002';
var savePath="";

function getRootPath(){
    //获取当前网址
    var curWwwPath=window.document.location.href;

    //获取主机地址之后的目录，
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8081
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/chuchai
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    //判断是否存在端口号或者上下文
   	if(projectName == '/visualization'){
    	return("");
    }else{
    	return(projectName);
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) 
    	return unescape(r[2]);
    return null; //返回参数值
}
var xfield = decodeURI(getUrlParam("xfield"));
var yfield = decodeURI(getUrlParam("yfield"));
var yfield2 = decodeURI(getUrlParam("yfield2"));
var sourcename= getUrlParam("sourcename");
var type = getUrlParam("type");
var visualizationid=getUrlParam("visualizationid");
var permissionsflag=getUrlParam("permissions");//权限标志
var classificationid=getUrlParam("classificationid");
var builtinconditions=decodeURI(getUrlParam("builtinconditions"));
var classificationname="";
if(getUrlParam("classificationname")){
	classificationname=decodeURI(getUrlParam("classificationname"));
}
var map={
    'cond.type':type,
	'cond.visualizationid':visualizationid,
	'cond.xfield':xfield,
	'cond.yfield':yfield,
    'cond.yfield2':yfield2,
	'cond.sourceid':sourcename,
	'cond.classificationid':classificationid,
	'cond.builtinconditions':builtinconditions
};

function getLayerLoad(tcId){
	$.ajax({   
		url:SERVER_URL+"/visualization/core/selectDatasourceInfosByCond",
		type : "post",  
		dataType : "json",  
		success:function(data){
			var h="";
		   $.each(data.datasourceInfos, function(key, value) {//拼接option  
				h += "<option value='" + value.sourceid + "'>" + value.sourcename  
					+ "</option>"; 
			});  
			$("#"+tcId).append(h);//append 添加进去并展示 
			$("#"+tcId).on("change",function(a,b,c){
				var index = $("#"+tcId+" option:selected")[0].index-1;
				if(index >= 0){
					var querySql=data.datasourceInfos[index].querySql;
					if(querySql&&querySql!=''){
						sourceType = 1;
					}else{
						sourceType = 0;
					}
				}
				builtinconditions=data.datasourceInfos[index].builtinconditions;
				var sourceid=$("#"+tcId+" option:selected")[0].value;
				if(sourceid=="---请选择---"||sourceid=='---choose---'){
					$("#xfield").empty();
					$("#yfield").empty();
                    $("#yfield2").empty();
					return;
				}
				if(builtinconditions){
					if(document.getElementById("inconditions")){
						document.getElementById("inconditions").setAttribute("style","");
					}
					if(document.getElementById("builtinconditions")){
						document.getElementById("builtinconditions").value=builtinconditions;
					}
				}else{
					if(document.getElementById("inconditions")){
						document.getElementById("inconditions").setAttribute("style","display:none");
					}
					if(document.getElementById("builtinconditions")){
						document.getElementById("builtinconditions").value='';
					}
				}
				$.ajax({   
					url:SERVER_URL+"/visualization/core/selectDatadetailInfosByCond",
					type : "post",  
					data:{
						"cond.sourceid":sourceid
					},
					dataType : "json",  
					success:function(data){
						if(data.datadetailInfos){
							$("#xfield").empty();
							$("#yfield").empty();
                            $("#yfield2").empty();
							var d="";
							var dy="";
							$.each(data.datadetailInfos, function(key, value) {//拼接option  
								if(value.fieldalias && value.fieldalias != '') {
									d += "<option value='" + value.field + "'>" + value.fieldalias  
										+ "</option>"; 
								} else {
									d += "<option value='" + value.field + "'>" + value.field 
										+ "</option>";
								}
								if(value.datatype == "0") {
									if(value.fieldalias && value.fieldalias != '') {
										dy += "<option value='" + value.field + "'>" + value.fieldalias  
										 + "</option>";
									} else {
										dy += "<option value='" + value.field + "'>" + value.field  
										 + "</option>";
									}
								}
							});  
							$("#xfield").append(d);
							$("#yfield").append(dy);
                            $("#yfield2").append(dy);
							if(tcId=="drillselectpicker"){
								$("#associated").empty();
								$("#associated").append(d);
							}else{
								if(document.getElementById("chartype").value!='k'){
		                            $("#yfield").attr("multiple","multiple");
								}
							}
							$('#yfield').multiselect("destroy").multiselect({
							  buttonClass: 'btn',
							  buttonWidth: 'auto',
							  buttonText: function(options) {
								if (options.length == 0) {
								  return $.i18n.prop('selectData');
								}
								else {
								  var selected = '';
								  options.each(function() {
									selected += $(this).text() + ',';
								  });
								  return selected.substr(0, selected.length -1) ;
								}
							  },
							   nonSelectedText: $.i18n.prop('selectData'),  
							   enableFiltering: true,  
							   allSelectedText:$.i18n.prop('allselect'),
							   selectAllText: $.i18n.prop('allselect'), 
							   enableClickableOptGroups: true,  
							   enableCollapsibleOptGroups: true,  
							   includeSelectAllOption: true,   
							   dropRight: true,  

						});
							//K线图里要用的最大值一列
                            //$("#yfield2").attr("multiple","multiple");
                            $('#yfield2').multiselect("destroy").multiselect({
                                buttonClass: 'btn',
                                buttonWidth: 'auto',
                                buttonText: function(options) {
                                    if (options.length == 0) {
                                        return $.i18n.prop('selectData');
                                    }
                                    else {
                                        var selected = '';
                                        options.each(function() {
                                            selected += $(this).text() + ',';
                                        });
                                        return selected.substr(0, selected.length -1) ;
                                    }
                                },
                                nonSelectedText: $.i18n.prop('selectData'),
                                enableFiltering: true,
                                allSelectedText:$.i18n.prop('allselect'),
								selectAllText: $.i18n.prop('allselect'),
                                enableClickableOptGroups: true,
                                enableCollapsibleOptGroups: true,
                                includeSelectAllOption: true,
                                dropRight: true,

                            });
							$(".multiselect-search").attr('placeholder',$.i18n.prop('search'));
                        }
					}
				});
			})					
		}
	});
}
/**
 * 为删除拟态框传值
 */
$('#delete').on('show.bs.modal',function (event) {
    var button = $(event.relatedTarget);
    var dataid = button.data('id');
	var type = button.data('type');
	sessionStorage["dataid"]=dataid;
	sessionStorage["type"]=type;
})
/**
 * 删除
 */
function deleteT() {
	var url="";
	var data ={};
	if(sessionStorage.type=="1"){
		url="/visualization/visualization/deleteClassification";
		data={"cond.classificationid":sessionStorage.dataid};
	}else if(sessionStorage.type=="0"){
		url="/visualization/visualization/deleteVisualizationInfo";
		data={"cond.visualizationid":sessionStorage.dataid};
	}else if(sessionStorage.type=="2"){
		url="/visualization/report/deleteVisualizationreportInfo";
		data={jsonString :JSON.stringify({"visualizationreportInfo":{"reportid":sessionStorage.dataid}})};
	}					
	$.ajax({
        url:SERVER_URL + url,    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data:data,
        type: "post",   //请求方式

        success: function (result) {
			$('#delete').modal('hide');
			if (sessionStorage.type == "0") {
				if(result==0){
					layer.msg($.i18n.prop('quoteddelete'), {offset: '0px',anim: 5,icon: 2,skin:'winning-class'});	
					return;
				}
			}else if (sessionStorage.type == "1") {
				if(result>0){
					layer.msg($.i18n.prop('chartoutside'), {offset: '0px',anim: 5,icon: 2,skin:'winning-class'});
				}
			}
           freshen();
        },
        complete: function () {

        },
        error: function () {
        }
    });
}
/**
 * 刷新功能
 */
function freshen(){
	//$("#result").html('');
   window.location.reload();
   //createShowing();
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
 * 返回上一页
 */
function doback(){
	window.location.href=SERVER_URL+"/visualization/category.html";
}