/**
 * 数据连接表格
 */
function createtable() {
    var alltables = [];
    $.ajax({
        url: SERVER_URL + "/visualization/core/selectConnectionInfosByCond",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        type: "post",   //请求方式
        success: function (result) {
            alltables = result.dataconnectionInfos;
        },
        complete: function () {

        },
        error: function () {
        }
    });
	var userLanguage = getCookie("userLanguage");
    $('#table').bootstrapTable('destroy').bootstrapTable({
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		locale: !userLanguage||userLanguage =='zh-CN'?'zh-CN':'en-US',     //国际化
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
		searchOnEnterKey: true,
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 1,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        columns: [{
            field: 'connectionname',
            title: $.i18n.prop('connectionInformation')
        }],
        data: alltables
    });
    //点击数据连接表格中的行触发点击事件：显示连接信息
    $('#table').on('click-row.bs.table', function (e, row, element)
    {
        $('#dsform').bootstrapValidator('resetForm', true);
        if(tab==0){
            connectiontype = row.connectiontype;
            $('#dsyuanxinxi').removeClass('bannedclick');
            $('#permissions').removeClass('bannedclick');
            connectionid = row.connectionid;
            $('#iframe').attr("src",'permission.html?connectionid='+connectionid);
            if( connectiontype =='excel'){
                $.ajax({
                    url:SERVER_URL+"/visualization/core/selectDatadetailInfosByCond",    //请求的url地址
                    dataType: "json",   //返回格式为json
                    type: 'post',
                    async: false,
                    cache: false,
                    dataType: 'json',
                    timeout: 60000,
                    data:{"cond.connectionid":connectionid},    //参数值
                    success: function (result) {
                        datadetailInfos=result.datadetailInfos;
                        createTable("exceltable");
                        document.getElementById("tipsxxx").setAttribute("style","display:none");
                        document.getElementById("exceldsmb").setAttribute("style","");
                        document.getElementById("dsmb").setAttribute("style","display:none");
                        document.getElementById('excelsource').value = row.connectionname;
                        document.getElementById("excelpre").setAttribute("style","display:none");
                        document.getElementById("excelsave").setAttribute("style","display:none");
                        document.getElementById("exceldiv").setAttribute("style","");
                    },
                    error: function () {
                    }
                });

            }else{
                document.getElementById("tipsxxx").setAttribute("style","display:none");
                document.getElementById("exceldsmb").setAttribute("style","display:none");
                document.getElementById("dsmb").setAttribute("style","");
                document.getElementById('DataSource').value = row.connectionname;
                document.getElementById('dataip').value = row.server;
                document.getElementById('port').value = row.port;
                document.getElementById('username').value = row.username;
                document.getElementById('password').value = row.password;
                document.getElementById('dbname').value = row.instancename;
                document.getElementById("connbutton").setAttribute("style","display:none");
            }
        }
    });

}
/**
 * 验证数据库连接并保存
 */
function getconn() {
    var dataconnectionInfo = {
		"connectionid":connectionid,
        "connectiontype":connectiontype,
        "connectionname":$("#DataSource").val(),
        "server":$("#dataip").val(),
        "port":$("#port").val(),
        "username":$("#username").val(),
        "password":$("#password").val(),
        "instancename":$("#dbname").val()
    };
    var bootstrapValidator = $("#dsform").data('bootstrapValidator');
    $("#dsform").bootstrapValidator('validate');
    if(bootstrapValidator.isValid()){
        $.ajax({
            url:SERVER_URL+"/visualization/core/obtainConnections",    //请求的url地址
            dataType: "json",   //返回格式为json
            type: 'post',
            async: false,
            cache: false,
            dataType: 'json',
            timeout: 60000,
            data:{jsonString :JSON.stringify({"dataconnectionInfo":dataconnectionInfo})},    //参数值
            success: function (result) {
                if(result.num == 1){
                    layer.alert($.i18n.prop('connectionSucceeded'));
                    connectionid = result.dataconnectionInfo.connectionid;
                    $('#iframe').attr("src",'permission.html?connectionid='+connectionid);
                    $('#dsyuanxinxi').removeClass('bannedclick');
                    $('#permissions').removeClass('bannedclick');
                    createtable();
                }else if(result.num == 0){
                    layer.alert($.i18n.prop('connectionfailed'));
                }
            },
            error: function () {
            }
        });
    }
}

function mysqlds(){
    connectiontype='mysql';
    $('#dsform').get(0).reset();
    $('#dsform').bootstrapValidator('resetForm', true);
    document.getElementById("tipsxxx").setAttribute("style","display:none");
    document.getElementById("exceldsmb").setAttribute("style","display:none");
    document.getElementById("dsmb").setAttribute("style","");
    document.getElementById("connbutton").setAttribute("style","");
    $('#adddataconn').modal('hide');
    $('#dsyuanxinxi').addClass('bannedclick');
    $('#permissions').addClass('bannedclick');
    connectionid='';

}

function excelds() {
    connectiontype="excel";
    $('#exceldsform').get(0).reset();
    $('#htmlout').empty();
    document.getElementById("excelsave").setAttribute("style","");
    document.getElementById("tipsxxx").setAttribute("style","display:none");
    document.getElementById("dsmb").setAttribute("style","display:none");
    document.getElementById("exceldsmb").setAttribute("style","");
    document.getElementById("excelpre").setAttribute("style","");
    document.getElementById("exceldiv").setAttribute("style","display:none");
    $('#adddataconn').modal('hide');
    $('#dsyuanxinxi').addClass('bannedclick');
    $('#permissions').addClass('bannedclick');
    connectionid='';
}

function oracleds() {
    connectiontype='oracle';
    $('#dsform').get(0).reset();
    $('#dsform').bootstrapValidator('resetForm', true);
    document.getElementById("tipsxxx").setAttribute("style","display:none");
    document.getElementById("exceldsmb").setAttribute("style","display:none");
    document.getElementById("dsmb").setAttribute("style","");
    document.getElementById("connbutton").setAttribute("style","");
    $('#adddataconn').modal('hide');
    $('#dsyuanxinxi').addClass('bannedclick');
    $('#permissions').addClass('bannedclick');
    connectionid='';
}

function sqlserverds() {
    connectiontype='sqlserver';
    $('#dsform').get(0).reset();
    $('#dsform').bootstrapValidator('resetForm', true);
    document.getElementById("tipsxxx").setAttribute("style","display:none");
    document.getElementById("exceldsmb").setAttribute("style","display:none");
    document.getElementById("dsmb").setAttribute("style","");
    document.getElementById("connbutton").setAttribute("style","");
    $('#adddataconn').modal('hide');
    $('#dsyuanxinxi').addClass('bannedclick');
    $('#permissions').addClass('bannedclick');
    connectionid='';
}
/**
 * 数据源信息表格
 * @returns
 */
function shujuyuantable() {
    $.ajax({
        url: SERVER_URL + "/visualization/core/selectDatasourceInfosByCond",    //请求的url地址
        dataType: "json",   //返回格式为json
        data:{"cond.connectionid":connectionid},
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        type: "post",   //请求方式
        success: function (result) {
            shujuyuantables = result.datasourceInfos;
        },
        complete: function () {

        },
        error: function () {
        }
    });
    var tablestr = '';
    if (shujuyuantables.length==0||shujuyuantables[0].querySql != null){
        tablestr = "<table class=\"table\">\n" +
            "\t\t\t\t\t\t   <thead>\n" +
            "\t\t\t\t\t\t\t  <tr>\n" +
            "                  <th>"+$.i18n.prop('datasourceName')+"</th>\n" +
			"                  <th>"+$.i18n.prop('alias')+"</th>\n" +
            "                  <th>"+$.i18n.prop('source')+"</th>\n" +
            "\t\t\t\t\t\t\t\t  <th>"+$.i18n.prop('condition')+"</th>\n" +
            "\t\t\t\t\t\t\t\t  <th>"+$.i18n.prop('founder')+"</th>\n" +
            "\t\t\t\t\t\t\t\t  <th>"+$.i18n.prop('permissions')+"</th>\n" +
            "\t\t\t\t\t\t\t  </tr>\n" +
            "\t\t\t\t\t\t   </thead>\n" +
            "\t\t\t\t\t\t   <tbody>";
    }else{
        tablestr = "<table class=\"table\">\n" +
            "\t\t\t\t\t\t   <thead>\n" +
            "\t\t\t\t\t\t\t  <tr>\n" +
            "                  <th>"+$.i18n.prop('datasourceName')+"</th>\n" +
            "                  <th>"+$.i18n.prop('source')+"</th>\n" +
            "\t\t\t\t\t\t\t\t  <th>"+$.i18n.prop('founder')+"</th>\n" +
            "\t\t\t\t\t\t\t\t  <th>"+$.i18n.prop('permissions')+"</th>\n" +
            "\t\t\t\t\t\t\t  </tr>\n" +
            "\t\t\t\t\t\t   </thead>\n" +
            "\t\t\t\t\t\t   <tbody>";
    }

    for (var i = 0; i < shujuyuantables.length; i++) {
		var querySql='';
		if(shujuyuantables[i].querySql){
			querySql = shujuyuantables[i].querySql.replace(/\"/g,"\'");
			querySql = shujuyuantables[i].querySql.replace(/\'/g,"\\\'");
		}
        if(querySql != ''){
            tablestr = tablestr + "<tr>\n" +
                "                 <td><a href=\"javascript:showshujuyuanbytable('"+shujuyuantables[i].connectionid+"','"+querySql+"')\">"+shujuyuantables[i].sourcename+"</a></td>\n" +
                "\t\t\t\t\t\t\t\t <td><a href=\"#\" onclick=\"showdsAlias("+shujuyuantables[i].sourceid+")\">"+$.i18n.prop('modify')+"</a></td>\n" +
				"\t\t\t\t\t\t\t\t <td>"+connectiontype+"</td>\n" +
                "\t\t\t\t\t\t\t\t <td><a href=\"javascript:showshujuyuanbysql('"+querySql+"')\">"+$.i18n.prop('view')+"</a></td>\n" +
                "\t\t\t\t\t\t\t\t <td>"+shujuyuantables[i].recorderdesc+"</td>\n" +
                "\t\t\t\t\t\t\t\t <td><a href=\"#\" onclick=\"showdsPermission("+shujuyuantables[i].sourceid+")\">"+$.i18n.prop('configuration')+"</a></td>\n" +
                "\t\t\t\t\t\t\t  </tr>";
        }else{
            tablestr = tablestr + "<tr>\n" +
                "                 <td><a href=\"javascript:showshujuyuanbytable('"+shujuyuantables[i].connectionid+"')\">"+shujuyuantables[i].sourcename+"</a></td>\n" +
                "\t\t\t\t\t\t\t\t <td><a href=\"#\" onclick=\"showdsAlias("+shujuyuantables[i].sourceid+")\">"+$.i18n.prop('modify')+"</a></td>\n" +
                "\t\t\t\t\t\t\t\t <td>"+connectiontype+"</td>\n" +
                "\t\t\t\t\t\t\t\t <td>"+shujuyuantables[i].recorderdesc+"</td>\n" +
                "\t\t\t\t\t\t\t\t <td><a href=\"#\" onclick=\"showdsPermission("+shujuyuantables[i].sourceid+")\">"+$.i18n.prop('configuration')+"</a></td>\n" +
                "\t\t\t\t\t\t\t  </tr>";
        }

    }

    tablestr = tablestr + "</tbody>\n" +
        "\t\t\t\t\t\t</table>";
    $("#shujuyuantable").empty();
    $("#shujuyuantable").append(tablestr);

}
//点击数据源名称弹出预览表格
function showshujuyuanbytable(id,querySql){
    var map = {
        "cond.connectionid":id,
        "cond.sql":querySql
    }
    $.ajax({
        url: SERVER_URL + "/visualization/core/selectDatabySql",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data:map,
        type: "post",   //请求方式
        success: function (result) {
            datadetailInfos=result.datadetailInfos;
            createTable("yulantable");
        },
        complete: function () {

        },
        error: function () {
        }
    });
    $('#yulanmoban').modal('show')
}
//关闭数据源模态框
function closemodal1(){
    $('#addDrill').modal('hide');
    $('#sqlform').get(0).reset();
    $('#sqlform').bootstrapValidator('resetForm', true);

}
//保存数据库数据源
function savedatasorce(){
    var sqlformvali = $("#sqlform").data('bootstrapValidator');
    $("#sqlform").bootstrapValidator('validate');
    var querysql=getsql();
    if(sqlformvali.isValid()) {
        var tablename=$("#sql").val();
        for(var i=0;i<id;i++){
            tablename+=","+$("#sql"+id).val();
        }
        var vjson={"connectionid":connectionid,"sourcename":$('#datasourcename').val(),
            "querysql":querysql,"builtinconditions":$('#builtinconditions').val(),"tablename":tablename}
        $.ajax({
            url: SERVER_URL + "/visualization/core/saveDatasourceInfos",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: false,//请求是否异步，默认为异步，这也是ajax重要特性
            data:{jsonString :JSON.stringify({"datasourceInfo":vjson})},
            type: "post",   //请求方式
            success: function (result) {
                $('#addDrill').modal('hide');
                $('#sqlform').get(0).reset();
                shujuyuantable()
            },
            complete: function () {

            },
            error: function () {
            }
        });
    }
}

//关闭预览模态框
function closemodal2() {
    $('#yulanmoban').modal('hide');
    $('#yulantable').html('');
}
function a(str){
    var reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ ;
    if(reg.test(str)){
        return false;
    }
    return true;
}
//excel数据源保存按钮
function saveexceldata(){
    var dataconnectionInfo = {
        "connectiontype":connectiontype,
        "connectionid":connectionid,
        "connectionname":$("#excelsource").val()
    };
    var datadetailInfos=[];
    var bootstrapValidator = $("#exceldsform").data('bootstrapValidator');
    var type="0";
    $("#exceldsform").bootstrapValidator('validate');
    if(bootstrapValidator.isValid()){
        if(exceldata!=''){
            $.ajax({
                url:SERVER_URL+"/visualization/core/saveDataconnectionInfo",    //请求的url地址
                dataType: "json",   //返回格式为json
                type: 'post',
                async: false,
                cache: false,
                timeout: 60000,
                data:{jsonString :JSON.stringify({"dataconnectionInfo":dataconnectionInfo})},    //参数值
                success: function (result) {
                    if(result.datasourceInfo){
                        var exceldatas=exceldata.split("\n");
                        var filed="";
                        var length=exceldatas[0].split(",").length
                        for(var i=0;i<length;i++){
                            var datas=[];
                            type="0";
                            for(var j=0;j<exceldatas.length-1;j++){
                                if(j==0){
                                    filed=exceldatas[j].split(",")[i];
                                }else{
                                    var celldata=exceldatas[j].split(",")[i];
                                    if(celldata==null||celldata==undefined){
                                        datas.push("");
                                    }else{
                                        if (isNaN(celldata)){
                                            type="1";
                                        }else{
                                            celldata=Number(celldata);
                                        }
                                        datas.push(celldata);
                                    }
                                }
                            }
                            if(filed!=''&&filed!=null&&filed!=undefined){
                                connectionid=result.datasourceInfo.connectionid;
                                $('#iframe').attr("src",'permission.html?connectionid='+connectionid);
                                var datadetailInfo={"field":filed,"datatype":type,"data":JSON.stringify(datas),"sourceid":result.datasourceInfo.sourceid};
                                datadetailInfos.push(datadetailInfo);

                            }
                        }
                        var data={datadetailInfos:datadetailInfos};
                        var params={jsonString:JSON.stringify(data)};
                        $.ajax({
                            url:SERVER_URL + '/visualization/core/saveDatadetailInfos',    //请求的url地址
                            dataType: "json",   //返回格式为json
                            async: false,//请求是否异步，默认为异步，这也是ajax重要特性
                            data:params,
                            type: "post",   //请求方式
                            success: function (result) {
                                $('#dsyuanxinxi').removeClass('bannedclick');
                                $('#permissions').removeClass('bannedclick');
                                layer.alert($.i18n.prop('success'));
                                createtable();
                            },
                            complete: function () {
                            },
                            error: function () {
                            }
                        });
                    }
                },
                error: function () {
                }
            });
        }else{
            layer.open({
                title:$.i18n.prop('promotInformation'),
                content: $.i18n.prop('nodata')
            });
        }
    }
}
function createTable(tableid){
    var temp = {};
    var temparr = [];
    var dataarr =[];
    for(var i = 0;i<datadetailInfos.length;i++){
        temp = {field:datadetailInfos[i].field,title:datadetailInfos[i].field};
        temparr.push(temp);
    }
	var jsonstr=[];
	if(datadetailInfos[0]){
		jsonstr = JSON.parse(datadetailInfos[0].data);
	}
    var jsonstr2 = {};
    for (var j = 0; j < jsonstr.length; j++) {
        var datatemp = '';
        datatemp = '{';
        for (var i = 0; i < datadetailInfos.length; i++) {
            var jsonstrs = JSON.parse(datadetailInfos[i].data);
            var fieldname = datadetailInfos[i].field;
            var fieldvalue= jsonstrs[j]
            if(typeof(jsonstrs[j])=='string'){
                fieldvalue= fieldvalue.replace(/\\/g,"/");
                fieldvalue=fieldvalue.replace(/"/g,"\\\"");
                fieldvalue=fieldvalue.replace(/\r/g,'');
                fieldvalue=fieldvalue.replace(/\n/g,'');
            }
            datatemp += '"'+fieldname +'"'+ ':' +'"'+ fieldvalue +'"' +",";
        }
        datatemp = datatemp.substring(0,datatemp.length-1);
        datatemp = datatemp + '}';
        jsonstr2 = JSON.parse(datatemp);
        dataarr.push(jsonstr2);
    }
	var userLanguage = getCookie("userLanguage");
    $("#"+tableid).bootstrapTable('destroy');
    $("#"+tableid).bootstrapTable({
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
		locale: !userLanguage||userLanguage =='zh-CN'?'zh-CN':'en-US',     //国际化
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
		searchOnEnterKey: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 1,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        showExport: true,
        exportTypes: ['json', 'xml', 'csv', 'txt'],
        columns: temparr,
        data: dataarr
    });
}
//预览按钮
function yulansqlbytable(){
    var sqlformvali = $("#sqlform").data('bootstrapValidator');
    $("#sqlform").bootstrapValidator('validate');
	var querySql=getsql();
    var map = {
        "cond.connectionid":connectionid,
        "cond.querySql":querySql
    }
    if(sqlformvali.isValid()) {
        $.ajax({
            url: SERVER_URL + "/visualization/core/selectDatabySql",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: false,//请求是否异步，默认为异步，这也是ajax重要特性
            data: map,
            type: "post",   //请求方式

            success: function (result) {
                datadetailInfos = result.datadetailInfos;
                createTable("yulantable");
                $('#yulanmoban').modal('show');
            },
            complete: function () {

            },
            error: function () {
            }
        });
    }
}
function altRows(id){
    if(document.getElementsByTagName){
        var table = document.getElementById(id);
        var rows = table.getElementsByTagName("tr");

        for(i = 0; i < rows.length; i++){
            if(i % 2 == 0){
                rows[i].className = "evenrowcolor";
            }else{
                rows[i].className = "oddrowcolor";
            }
        }
    }
}


//查看权限
function showdsPermission(sourceid) {
    layer.open({
        type: 2,
        title: $.i18n.prop('permissionlist'),
        area: ['1100px', '95%'],
        shade: 0.8,
        closeBtn: 1,
        shadeClose: true,
        content: 'permission.html?sourceid='+sourceid,
    });
}
var getsql=function(){
	var querySql="";
	var from ="";
	if($("#sql").val()&&$("#column").val()){
		var column =$("#column").val().toString();
		querySql="select a0." +column.replace(/,/g,",a0.");
		from=" from " +$("#sql").val()+ " a0";
		var a="a";
		for(var i=0;i<id;i++){
			if($("#table"+id)[0]){
				if($("#sql"+id).val()&&$("#column"+id).val()){
					querySql+=",a"+(i+1)+"."+$("#column"+id).val().toString().replace(/,/g,",a"+(i+1)+".");
					from +="," +$("#sql"+id).val()+" a"+(i+1);
				}
			}
		}
		querySql+=from;
	}
	if($("#sqlstr").val()){
		querySql+=" where "+$("#sqlstr").val();
	}
	return querySql;
}
function querytable(){
	var vjson={"connectionid":connectionid};
	 $.ajax({
            url: SERVER_URL + "/visualization/core/selectTables",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: false,//请求是否异步，默认为异步，这也是ajax重要特性
            data: {jsonString :JSON.stringify({"dataconnectionInfo":vjson})},
            type: "post",   //请求方式

            success: function (result) {
				tables=result.list;
            },
            complete: function () {

            },
            error: function () {
            }
        });
}

//查看并修改别名
function showdsAlias(sourceid) {
	var map = {
        "cond.sourceid":sourceid
    }
    $.ajax({
        url: SERVER_URL + "/visualization/core/selectDatadetailInfosByCond",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data:map,
        type: "post",   //请求方式
        success: function (result) {
            datadetailInfos = result.datadetailInfos;
            createAliasTable("aliasTable");
			$('#aliasModal').modal('show');
        },
        complete: function () {

        },
        error: function () {
        }
    });
}

//别名表
function createAliasTable(tableid){
	var tableList = datadetailInfos;
	console.info(tableList);
	var columns=[{
				field: 'field',
				title: $.i18n.prop('field'),
			},{
				field: 'fieldalias',
				title: $.i18n.prop('fieldalias'),
				editable: {
                    type: 'text',
                    title: '别名',
                },
			}];
	var userLanguage = getCookie("userLanguage");
    $("#"+tableid).bootstrapTable('destroy').bootstrapTable({
        toolbar: '#toolbar',                //工具按钮用哪个容器
		editable:true,
        striped: true,                      //是否显示行间隔色
		locale: !userLanguage||userLanguage =='zh-CN'?'zh-CN':'en-US',     //国际化
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
		searchOnEnterKey: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 1,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        showExport: true,
        exportTypes: ['json', 'xml', 'csv', 'txt'],
        columns: columns,
        data: tableList,
		onEditableSave: function (field, row, oldValue, $el) {
			var datadetailInfos=[];
			datadetailInfos.push(row);
            $.ajax({
                type: "post",
                url: SERVER_URL + "/visualization/core/saveDatadetailInfos",
				data:{jsonString :JSON.stringify({"datadetailInfos":datadetailInfos})},
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

//关闭预览模态框
function closemodal3() {
    $('#aliasModal').modal('hide');
    $('#aliasTable').html('');
}

