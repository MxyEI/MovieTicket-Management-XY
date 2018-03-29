/*
 *@生成角色列表
 *
 */
 function createPermissiontable() {
    var tablelist = [];
	var url = "";
	var columns=[{
				field: 'permissionsid',
				title: $.i18n.prop('permissionsid')
			},{
				field: 'roleid',
				title: $.i18n.prop('roleid')
			}, {
				field: 'rolecode',
				title: $.i18n.prop('rolecode')
			}, {
				field: 'roledesc',
				title: $.i18n.prop('roledesc')
			}];
	var data={};
	var visualizationid = getUrlParam("visualizationid");
	var reportid = getUrlParam("reportid");
	var sourceid = getUrlParam("sourceid");
	var connectionid = getUrlParam("connectionid");
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
	$.ajax({
		url: SERVER_URL + url,    //请求的url地址
		dataType: "json",   //返回格式为json
		async: false,//请求是否异步，默认为异步，这也是ajax重要特性
		type: "post",   //请求方式
		data: data,
		success: function (result) {
			if(sourceid && sourceid != '') {
				columns.splice(1,0,{field: 'sourceid',title: $.i18n.prop('sourceid')});
				columns.unshift({checkbox: true});
				tablelist = result.datasourceRoleInfos;
			}else if(reportid && reportid != '') {
				columns.splice(1,0,{field: 'reportid',title: $.i18n.prop('reportid')});
				columns.unshift({checkbox: true});
				columns.push({
					field: 'permissions',
					title: $.i18n.prop('permissions'),
					editable: {
	                   type: 'select',
	                   title: $.i18n.prop('permissions'),
	                   source:[{value:"0",text:$.i18n.prop('view')},{value:"1",text:$.i18n.prop('edit')},{value:"2",text:$.i18n.prop('administrator')}]
	                }
				});
				tablelist = result.reportRoleInfos;
			}else if(visualizationid && visualizationid != '') {
				columns.splice(1,0,{field: 'visualizationid',title: $.i18n.prop('visualizationid')});
				columns.unshift({checkbox: true});
				columns.push({
					field: 'permissions',
					title: $.i18n.prop('permissions'),
					editable: {
	                   type: 'select',
	                   title: $.i18n.prop('permissions'),
	                   source:[{value:"0",text:$.i18n.prop('user')},{value:"1",text:$.i18n.prop('administrator')}]
	                }
				});
				tablelist = result.visualizationRoleInfos;
			}else if(connectionid && connectionid != '') {
				columns.splice(1,0,{field: 'connectionid',title: $.i18n.prop('connectionid')});
				columns.unshift({checkbox: true});
				tablelist = result.connectRoleInfos;
			}
		},
		complete: function () {},
		error: function () {}
	});
	var userLanguage = getCookie("userLanguage");
	$('#table').bootstrapTable('destroy').bootstrapTable({
		toolbar: '#toolbar',                //工具按钮用哪个容器
		locale: !userLanguage||userLanguage =='zh-CN'?'zh-CN':'en-US',     //国际化
		striped: true,                      //是否显示行间隔色
		cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination: true,                   //是否显示分页（*）
		sortable: false,                     //是否启用排序
		sortOrder: "asc",                   //排序方式
		sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
		pageNumber: 1,                       //初始化加载第一页，默认第一页
		pageSize: 10,                       //每页的记录行数（*）
		pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
		search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
		strictSearch: false,
		showColumns: true,                  //是否显示所有的列
		undefinedText:'',
		searchOnEnterKey:true,
		showRefresh: false,                  //是否显示刷新按钮
		minimumCountColumns: 1,             //最少允许的列数
		clickToSelect: true,                //是否启用点击选中行
		uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
		showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
		cardView: false,                    //是否显示详细视图
		detailView: false,                   //是否显示父子表
		showExport: true,
		exportTypes: ['json', 'xml', 'csv', 'txt'],
		columns: columns,
		data: tablelist,
		onEditableSave: function (field, row, oldValue, $el) {
			var permissions=[];
			permissions.push(row);
			if(reportid && reportid != '') {
				url = "/visualization/security/saveReportRoleInfos";
				data={jsonString :JSON.stringify({"reportRoleInfos":permissions})};
			}else if(visualizationid && visualizationid != '') {
				url = "/visualization/security/saveVisualizationRoleInfos";
				data={jsonString :JSON.stringify({"visualizationRoleInfos":permissions})};
			}
			$.ajax({
				type: "post",
				url: SERVER_URL+url,
				data: data,
				dataType: 'JSON',
				success: function (data, status) {
					if (status == "success") {
						layer.msg($.i18n.prop('successfullymodified'), {
								offset: '0px',anim: 5,icon: 1,skin:'winning-class'});
					}
				},
				error: function () {
					layer.msg($.i18n.prop('failedit'), {
								offset: '0px',anim: 5,icon: 2,skin:'winning-class'});
				},
				complete: function () {

				}

			});
		}
	});
}

//查看角色列表
function showRole(){
	var params="";
	var visualizationid = getUrlParam("visualizationid");
	var reportid = getUrlParam("reportid");
	var sourceid = getUrlParam("sourceid");
	var connectionid = getUrlParam("connectionid");
	if(sourceid && sourceid != '') {
		params = "?sourceid="+sourceid;
	}else if(reportid && reportid != '') {
		params = "?reportid="+reportid;
	}else if(visualizationid && visualizationid != '') {
		params = "?visualizationid="+visualizationid;
	}else if(connectionid && connectionid != '') {
		params = "?connectionid="+connectionid;
	}else {
		return;
	}
	parent.layer.open({
		type: 2,
		title: $.i18n.prop('listroles'),
		area: ['1100px', '95%'],
		shade: 0.8,
		closeBtn: 1,
		moveOut:true,
		shadeClose: true,
		//content: SERVER_URL+'/visualization/role.html'+params,
        content: 'role.html'+params,
		success:function(){
			var index = layer.getFrameIndex(window.name);
			layer.iframeAuto(index);
		},
		end:function(){
			createPermissiontable();
		}
	});
}
function deleteRole(){
	var rolelist = $('#table').bootstrapTable('getAllSelections');
	if(rolelist.length == 0) {
		layer.msg($.i18n.prop('selectdelete'), {offset: '0px',anim: 5,icon: 2,skin:'winning-class'});	
		return;
	}
	var visualizationid = getUrlParam("visualizationid");
	var reportid = getUrlParam("reportid");
	var sourceid = getUrlParam("sourceid");
	var connectionid = getUrlParam("connectionid");
	var permissions=[];
	var data = {};
	var ids = $.map($('#table').bootstrapTable('getAllSelections'), function (row) {
		return row.permissionsid;
	});
	for(var i = 0; i < rolelist.length; i++) {
		var permission={"permissionsid":rolelist[i].permissionsid}
		permissions.push(permission);
	}
	if(sourceid && sourceid != '') {
		url = "/visualization/security/deleteDatasourceRoleInfos";
		data={jsonString :JSON.stringify({"datasourceRoleInfos":permissions})};
	}else if(reportid && reportid != '') {
		url = "/visualization/security/deleteReportRoleInfos";
		data={jsonString :JSON.stringify({"reportRoleInfos":permissions})};
	}else if(visualizationid && visualizationid != '') {
		url = "/visualization/security/deleteVisualizationRoleInfos";
		data={jsonString :JSON.stringify({"visualizationRoleInfos":permissions})};
	}else if(connectionid && connectionid != '') {
		url = "/visualization/security/deleteConnectRoleInfos";
		data={jsonString :JSON.stringify({"connectRoleInfos":permissions})};
	}
	$.ajax({
        url: SERVER_URL + url,   //请求的url地址
        dataType: "json",        //返回格式为json
        async: false,            //请求是否异步，默认为异步，这也是ajax重要特性
        type: "post",            //请求方式
		data: data,
        success: function (result) {
			$('#table').bootstrapTable('remove', {
				field: 'permissionsid',
				values: ids
			});
			layer.msg($.i18n.prop('successfullydeleted'), {
								offset: '0px',anim: 5,icon: 1,skin:'winning-class'});
        },
        complete: function () {
        },
        error: function () {
        }
    });
}
