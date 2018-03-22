/*
 *@生成角色列表
 *
 */
 function createRoletable() {
	 var visualizationid = getUrlParam("visualizationid");
	var reportid = getUrlParam("reportid");
	var sourceid = getUrlParam("sourceid");
	var connectionid = getUrlParam("connectionid");
    var alltables = [];
    $.ajax({   //获取所有的角色信息
        url: SERVER_URL + "/core/selectRoleInfoByCond",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        type: "post",   //请求方式
        success: function (result) {
            alltables = result.roleInfos;
        },
        complete: function () {

        },
        error: function () {
        }
    });
    
  
	var url = "";
	var data = [];
	var tablelist=[];
	if(sourceid && sourceid != '') {
		url = "/visualization/security/selectDatasourceRoleInfos";
		data={"cond.sourceid":sourceid};
	}else if(reportid && reportid != '') {
		url = "/visualization/security/selectReportRoleInfos";
		data={"cond.reportid":reportid};
	}else if(visualizationid && visualizationid != '') {
		url = "/visualization/security/selectVisualizationRoleInfos";
		data={"cond.visualizationid":visualizationid};
	}else if(connectionid && connectionid != '') {
		url = "/visualization/security/selectConnectRoleInfos";
		data={"cond.connectionid":connectionid};
	}
	$.ajax({    //获取某个模块拥有的角色
		 url: SERVER_URL + url,    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        type: "post",   //请求方式
		data: data,
        success: function (result) {
			if(sourceid && sourceid != '') {
				tablelist = result.datasourceRoleInfos;
			}else if(reportid && reportid != '') {
				tablelist = result.reportRoleInfos;
			}else if(visualizationid && visualizationid != '') {
				tablelist = result.visualizationRoleInfos;
			}else if(connectionid && connectionid != '') {
				tablelist = result.connectRoleInfos;
			}
        },
		//获取某个模块拥有的角色的数据
        complete: function () {

        },
        error: function () {
        }
	});
	
	//给某个模块拥有的角色在角色页面显示已经勾选，此时应该设置alltable数据中加上state:false/true的属性值
	for(var i = 0;i < alltables.length; i++) {
		for(var j = 0;j < tablelist.length; j++) {
			if(tablelist[j].roleid == alltables[i].roleid){
				alltables[i].state=true;
			}
		}
	}
	var userLanguage = getCookie("userLanguage");
    $('#table').bootstrapTable('destroy').bootstrapTable({
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		locale: !userLanguage||userLanguage =='zh-CN'?'zh-CN':'en-US',     //国际化
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 15,                       //每页的记录行数（*）
        pageList: [15, 30, 50, 100],        //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
		searchOnEnterKey:true,
		maintainSelected:true,
        minimumCountColumns: 1,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
		undefinedText:'',
        detailView: false,                   //是否显示父子表
        showExport: true,
        exportTypes: ['json', 'xml', 'csv', 'txt'],
        columns: [{
			field:'state',
			checkbox: true,
			formatter:stateFormatter
		},{
            field: 'roleid',
            title: $.i18n.prop('roleid')
        }, {
            field: 'roledesc',
            title: $.i18n.prop('roledesc')
        }, {
            field: 'usecorpcode',
            title: $.i18n.prop('usecorpcode')
        }, {
            field: 'recorderdesc',
            title: $.i18n.prop('recorderdesc')
        }, {
            field: 'remark',
            title: $.i18n.prop('remark')
        }],
        data: alltables
    });
}
 
 //已拥有角色勾选的辅助方法
 function stateFormatter(value,row,index) {
		if(row.state == true) {
			return {
				disable:false,
				checked:true
			}
		}
		return value;
	}

/*
 *@保存角色信息
 *
 */
function saveRole() {
	var rolelist = $('#table').bootstrapTable('getAllSelections');
	var visualizationid = getUrlParam("visualizationid");
	var reportid = getUrlParam("reportid");
	var sourceid = getUrlParam("sourceid");
	var connectionid = getUrlParam("connectionid");
	var url = "";
	var data = {};
	if(rolelist.length == 0) {
		return;
	}
	if(sourceid && sourceid != '') {
		url = "/visualization/security/saveDatasourceRoleInfos";
		var datasourceRoleInfos=[];
		for(var i = 0; i < rolelist.length; i++) {
			var datasourceRoleInfo={"sourceid":sourceid,"roleid":rolelist[i].roleid,"rolecode":rolelist[i].rolecode}
			datasourceRoleInfos.push(datasourceRoleInfo);
		}
		data={jsonString :JSON.stringify({"datasourceRoleInfos":datasourceRoleInfos})};
	}else if(reportid && reportid != '') {
		url = "/visualization/security/saveReportRoleInfos";
		var reportRoleInfos=[];
		for(var i = 0; i < rolelist.length; i++) {
			var reportRoleInfo={"reportid":reportid,"roleid":rolelist[i].roleid,"rolecode":rolelist[i].rolecode}
			reportRoleInfos.push(reportRoleInfo);
		}
		data={jsonString :JSON.stringify({"reportRoleInfos":reportRoleInfos})};
	}else if(visualizationid && visualizationid != '') {
		url = "/visualization/security/saveVisualizationRoleInfos";
		var visualizationRoleInfos=[];
		for(var i = 0; i < rolelist.length; i++) {
			var visualizationRoleInfo={"visualizationid":visualizationid,"roleid":rolelist[i].roleid,"rolecode":rolelist[i].rolecode}
			visualizationRoleInfos.push(visualizationRoleInfo);
		}
		data={jsonString :JSON.stringify({"visualizationRoleInfos":visualizationRoleInfos})};
	}else if(connectionid && connectionid != '') {
		url = "/visualization/security/saveConnectRoleInfos";
		var connectRoleInfos=[];
		for(var i = 0; i < rolelist.length; i++) {
			var connectRoleInfo={"connectionid":connectionid,"roleid":rolelist[i].roleid,"rolecode":rolelist[i].rolecode}
			connectRoleInfos.push(connectRoleInfo);
		}
		data={jsonString :JSON.stringify({"connectRoleInfos":connectRoleInfos})};
	}else {
		return;
	}
	$.ajax({
        url: SERVER_URL + url,   //请求的url地址
        dataType: "json",        //返回格式为json
        async: false,            //请求是否异步，默认为异步，这也是ajax重要特性
        type: "post",            //请求方式
		data: data,
        success: function (result) {
			var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引\
			
			parent.layer.close(index);	
        },
        complete: function () {
        },
        error: function () {
        }
    });
}

function closeRole(){
	var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
	parent.layer.close(index);	
}