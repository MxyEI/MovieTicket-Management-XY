/**
 * 查看大图
 */

function largerimage(){
    sessionStorage['option'] =JSON.stringify(option) ;
    parent.layer.open({
        type: 2,
        title: $.i18n.prop('larger image'),
        area: ['1100px', '95%'],
        shade: 0.8,
        closeBtn: 1,
        shadeClose: true,
        content: SERVER_URL+'/visualization/largerimage.html',
        cancel :function(){

        }
    });
}

/**
 * 生成图表
 */
function exportImage(){  
	var opts={type:"1:1"};
	var data = myChart.getConnectedDataURL(opts); ;
	var visualizationInfo = {
			"type":type,"classificationid":classificationname,
			"img":$.base64.btoa(data),"xdata":JSON.stringify(xarray) ,
			"ydata":JSON.stringify(yarray),"options":JSON.stringify(option),
			"drillflag":drillflag,"xfield":xfield,"yfield":yfield
		};
	if(yfield2){
		visualizationInfo.yfield2=yfield2;
		visualizationInfo.ydata2=JSON.stringify(yarray2);
	}
	$.ajax({
		url: SERVER_URL+'/visualization/visualization/saveVisualizationInfo', // 跳转到 action
		data:{jsonString :JSON.stringify({"visualizationInfo":visualizationInfo})},
		type: 'post',
		cache: false,
		async: false,
		dataType: 'json',
		timeout: 60000,
		success: function(data) {
			var visualizationid= data.visualizationInfo.visualizationid;		
			if(drillflag!='0'){
				var visualizationdrillInfo={};
				if(drillflag=='1'){
					visualizationdrillInfo={
						"visualizationid":visualizationid,"drilltype":drilltype,
						"sourceid":sourceid,"drillxfield":drillxfield,
						"drillyfield":drillyfield,"conditions":conditions,
						"associated":associated,"identifier":identifier
					};
				}else if(drillflag=='2'){
					visualizationdrillInfo={
						"visualizationid":visualizationid,"drillvisualizationid":drillvisualizationid
					};
				}
				$.ajax({
					url: SERVER_URL+'/visualization/visualization/saveVisualizationdrillInfo', // 跳转到 action
					data: {jsonString :JSON.stringify({"visualizationdrillInfo":visualizationdrillInfo})},
					type: 'post',
					cache: false,
					async: false,
					dataType: 'json',
					timeout: 60000,
					success: function(data) {
						parent.layer.open({
							type: 2,
							title: $.i18n.prop('permissionlist'),
							area: ['1100px', '95%'],
							shade: 0.8,
							closeBtn: 1,
							shadeClose: true,
							content: SERVER_URL+'/visualization/permission.html?visualizationid='+visualizationid,
							cancel :function(){
								parent.window.location.href=SERVER_URL+"/visualization/category.html";
							}
						});
						//parent.window.location.href=SERVER_URL+"/visualization/category.html";
					},
					error: function(jqXHR, textStatus, errorThrown) {
					}
				});
			}else{
				parent.layer.open({
					type: 2,
					title: $.i18n.prop('permissionlist'),
					area: ['1100px', '95%'],
					shade: 0.8,
					closeBtn: 1,
					moveOut:true,
					shadeClose: true,
					content: SERVER_URL+'/visualization/permission.html?visualizationid='+visualizationid,
					cancel :function(){
						parent.window.location.href=SERVER_URL+"/visualization/category.html";
					}
				});
				//
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.info(jqXHR)
		}
	});
}

function confirm(){
	sourceid = $("#drillselectpicker").val();
	drilltype=$("#drilltype").val();
	drillxfield=$("#xfield").val();
	drillyfield=$("#yfield").val();
	conditions=$('#conditions').val();
	associated=$('#associated').val();
	if (sourceid !=""&&drilltype!=''&&drillyfield!=''){
		drillDown();
		drillflag='1';
		$('#addDrill').modal('hide');
	}else {
		alert($.i18n.prop('completeform'));
	}
}
function drillDown(){
	if(visualizationid){
		$.ajax({
            url: SERVER_URL+'/visualization/visualization/selectVisualizationdrillInfoByCond', // 跳转到 action
            data: {
               "cond.visualizationid":visualizationid
            },
            async: false,//请求是否异步，默认为异步，这也是ajax重要特性
            type: 'post',
            cache: false,
            dataType: 'json',
            timeout: 60000,
            success: function(data) {
				if(data.visualizationdrillInfos){
					sourceid=data.visualizationdrillInfos[0].sourceid;
					drilltype=data.visualizationdrillInfos[0].drilltype;
					drillxfield=data.visualizationdrillInfos[0].drillxfield;
					drillyfield=data.visualizationdrillInfos[0].drillyfield;
					conditions=data.visualizationdrillInfos[0].conditions;
					associated=data.visualizationdrillInfos[0].associated;
					identifier=data.visualizationdrillInfos[0].identifier;
				}
            },
            error: function(jqXHR, textStatus, errorThrown) {
				
            }
        });
	}
	myChart.on('click',function(object){
		var condition='';
		if(conditions=='x轴'||conditions=='X axis'){
			condition=object.name;
		}else{
			condition=object.value;
		}	
		$.ajax({
				url: SERVER_URL+"/visualization/visualization/selectDataByCond",    //请求的url地址
				dataType: "json",   //返回格式为json
				async: false,//请求是否异步，默认为异步，这也是ajax重要特性
				data: {
						'cond.sourceid':sourceid,
						'cond.type':drilltype,
						'cond.xfield':drillxfield,
						'cond.yfield':drillyfield,
						'cond.conditions':condition,
						'cond.associated':associated
					},    //参数值
				type: "post",   //请求方式
				success: function (data) {
					drilloption = data.visualizationInfo.options;
					drilloption=JSON.parse(drilloption);
					identifier=data.visualizationInfo.identifier;
				},
				complete: function () {
					//请求完成的处理
				},
				error: function () {
					//请求出错处理
				}
			});
			  // 销毁之前的echarts实例
			echarts.dispose(document.getElementById('main'));
			var myChart = echarts.init(document.getElementById('main'));
			
			myChart.setOption(drilloption, true);
			div.setAttribute("style","display:none");				
			returndiv.setAttribute("style","margin-top: 20px;"); 
		});
}