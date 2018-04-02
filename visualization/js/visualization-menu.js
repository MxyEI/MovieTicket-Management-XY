this.menuSH=function (item,option,mains){

    var dom=document.getElementById(item);
    var resizeMainContainer = function () {

        dom.style.width = document.getElementById(mains).scrollWidth*0.9+'px';
        dom.style.height = document.getElementById(mains).scrollHeight*0.9+'px';

    };

    //设置div容器高宽
    resizeMainContainer();
    echarts.dispose(dom);
    // 初始化图表
    var myChart = echarts.init(dom);
    $('#'+mains).on('resize',function(){//
        //屏幕大小自适应，重置容器高宽

        resizeMainContainer();
        myChart.resize();
    });
    var option=option;
    document.getElementById(mains).addEventListener("resize", function () {
        option.chart.resize();
    },1000);
    myChart.setOption(option);

}

//添加文本框
this.addtxt=function(item,mains,txt,textcontent){
    var str='';
    if(textcontent==''){
        str = '<div id='+txt+' style="border:1;text-align:left;word-break:break-all; word-wrap:break-word ;height:100%;width:100%"><scan class=\"form-control\"  ondblclick=\"ShowElement(this)\" id=\"textarea\" style="resize:none;height:100%"><p style="color:#8f8f8f !important;font-weight:normal !important;">'+$.i18n.prop('clicktext')+'</p></scan>';
    }else{
        str = '<div id='+txt+' style="border:1;text-align:left;word-break:break-all; word-wrap:break-word ;height:100%;width:100%"><scan class=\"form-control\"  ondblclick=\"ShowElement(this)\" id=\"textarea\" style="resize:none;height:100%">'+textcontent+'</scan>';

    }
    document.getElementById(item).innerHTML=str;
}
function ShowElement(element) {
	if(permissionsflag!='0'){
		var oldhtml = element.innerHTML;
		if(oldhtml=='<p style="color:#8f8f8f !important;font-weight:normal !important;">'+$.i18n.prop('clicktext')+'</p>'){
			oldhtml='';
		}
		//创建新的input元素
		var newobj = document.createElement('textarea');
		var resizeMainContainer = function () {
			newobj.style.width = element.scrollWidth*0.9+'px';
			newobj.style.height = element.scrollHeight*0.9+'px';
			newobj.style.border=0;
		};

		resizeMainContainer();
		$(window).on('resize',function(){//
			//屏幕大小自适应，重置容器高宽
			resizeMainContainer();

		});
		//为新增元素添加类型
		newobj.type = 'text';
		//为新增元素添加value值
		newobj.value = oldhtml;
		//为新增元素添加光标离开事件
		newobj.onblur = function() {
			var value=this.value;
			//当触发时判断新增元素值是否为空，为空则不修改，并返回原有值
			element.innerHTML = this.value == oldhtml ? oldhtml :value;
			//当触发时设置父节点的双击事件为ShowElement
			element.setAttribute("ondblclick", "ShowElement(this);");
		}
		//设置该标签的子节点为空
		element.innerHTML = '';
		//添加该标签的子节点，input对象
		element.appendChild(newobj);
		//设置选择文本的内容或设置光标位置（两个参数：start,end；start为开始位置，end为结束位置；如果开始位置和结束位置相同则就是光标位置）
		newobj.setSelectionRange(0, oldhtml.length);
		//设置获得光标
		newobj.focus();

		//设置父节点的双击事件为空
		newobj.parentNode.setAttribute("ondblclick", "");
	}
}
ko.components.register('dashboard-grid', {
    viewModel: {
        createViewModel: function (controller, componentInfo) {
            var ViewModel = function (controller, componentInfo) {
                var grid = null;
                this.widgets = controller.widgets;
                this.afterAddWidget = function (items) {
                    if (grid == null) {
                        grid = $(componentInfo.element).find('.grid-stack').gridstack({
                            auto: false
                        }).data('gridstack');
                    }
                    var item = _.find(items, function (i) {
                        return i.nodeType == 1 });

                    var main="main"+j;
                    var mains="mains"+j;
                    $("#mains").find(".grid-stack-item-content")[0].setAttribute("id",main);
                    grid.add_widget(item);
                    if(mains!=null){
                        optionss[j].divname=mains;
                        if(optionss[j].addtype == 0){
                            menuSH(main,optionss[j].option,optionss[j].divname);
                        }else if(optionss[j].addtype == 1){
                            var txt = "txt"+j;
                            addtxt(main,mains,txt,optionss[j].textcontent);
                        }
                    }
                    if(permissionsflag=='0'){
                    	grid.disable();
                    }else{
						//创建右键菜单
						$("#"+mains).mousedown(function(e) {
							var rightMenuData = rightmenu(mains,grid);
							$("#"+mains).smartMenu(rightMenuData, {
								name: "rightMenu"
							});
						})
					}
					j++;
                    ko.utils.domNodeDisposal.addDisposeCallback(item, function () {
                        grid.remove_widget(item);
                    });
                };
            };

            return new ViewModel(controller, componentInfo);
        }
    },
    template: { element: 'gridstack-template' }
});
var Controller = function (widgets) {
    var self = this;

    this.widgets = ko.observableArray(widgets);
    this.add_new_widget = function () {
        for(var i=0;i<length;i++){
            this.widgets.push({
                x: 0,
                y: 0,
                width: 4,
                height: 4,
                auto_position: true
            });
        }
    };

    this.delete_widget = function (item) {
        self.widgets.remove(item);
    };

};

//右键菜单
function rightmenu(mains,grid){

    var rightMenuData = [];
    rightMenuData = [
        [
           // {
            //    text: "选项",
            //    data: [[{
            //        text: "标记",
            //        func: function() {
            //            $(this).css("border", "5px solid #34538b");
            //        }
            //    }, {
            //        text: "查看元素",
            //        func: function del() {
             //           var size=$(this)[0].id.substring($(this)[0].id.length-1);
             //       }
            //    }]]
            //},
            {
                text: $.i18n.prop('delete'),
                func: function() {
                    var size=$(this)[0].id.substring($(this)[0].id.length-1);
                    var chartid=optionss[size].chartid;
                    delete optionss[size];
                    echarts.dispose($(this)[0].children[0]);
                    grid.remove_widget($(this));
					layer.msg($.i18n.prop('successfullydeleted'), {
								offset: '60px',anim: 5,icon: 1,skin:'winning-class'});
                }
            }]

    ];
    return rightMenuData
}


//确认按钮
function queren() {

    var selectedimgs = [];

    selectedimgs = $("select").val();
    var widgets = [];
    if(selectedimgs.length!=0) {
        length=selectedimgs.length;
        for (var i = 0; i < selectedimgs.length; i++) {
            var temp = parseInt(selectedimgs[i]);
            optionss.push({"option":JSON.parse(allimgs[temp].options),"chartid":''
                ,"visualizationid":allimgs[temp].visualizationid,"addtype":0,
                "textcontent":''});
            widgets.push({
                x: 0,
                y: 0,
                width: 4,
                height: 4,
                auto_position: true
            });
        }
    }

    var controller = new Controller(widgets);
    if(click==0){
        ko.applyBindings(controller);
    }
    click=1;
}


function showChart() {
    addtype = 0;
    $.ajax({
        url: SERVER_URL + "/visualization/visualization/selectVisualizationInfos",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        type: "post",   //请求方式
        success: function (result) {
            allimgs = result.visualizationInfos;
            var htmlstr = '';
            htmlstr = htmlstr+"<div class=\"picker\">\n" +
                "                    <select multiple=\"multiple\" class=\"image-picker\">";
            for(var i = 0;i<allimgs.length;i++){
                htmlstr = htmlstr + "<option data-img-src="+"'"+$.base64.atob(allimgs[i].img)+"' value='"+i+"'></option>";
            }

            htmlstr = htmlstr + "</select>\n" +
                "                </div>";

            $("#imgpicker").empty();
            $("#imgpicker").html(htmlstr);

        },
        complete: function () {

        },
        error: function () {
        }
    });
}
function save_report() {

    if(optionss.length==0){
        layer.msg('请先制作报表', {
            offset: '60px',anim: 5,icon: 0,skin:'winning-class'});
        return;
    }
    var chartlocationInfos=[];
    var textcontent=''
    html2canvas(document.querySelector("#content")).then(canvas => {
        var strDataURI = canvas.toDataURL("image/jpeg");
    strDataURI=$.base64.btoa(strDataURI);
    var visualizationreportInfo={"reportid":reportid,"reportname":$("#context").val(),"reporturl":strDataURI};
    $.ajax({
        url: SERVER_URL + "/visualization/report/saveVisualizationreportInfo",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data:{jsonString :JSON.stringify({"visualizationreportInfo":visualizationreportInfo})},
        type: "post",   //请求方式
        success: function (result) {
            for(var i=0;i<optionss.length;i++){
                if(optionss[i]){
                    var mains=optionss[i].divname;
                    var size=mains.substring(mains.length-1);
                    var main="main"+size;
                    if(optionss[i].addtype==0){
                        textcontent='';
                    }else{
                        textcontent=$('#'+main+'')[0].textContent;
                    }
					reportid=result.reportid;
                    var chartlocationInfo={
                        "chartid":optionss[i].chartid,"reportid":result.reportid,"visualizationid":optionss[i].visualizationid,
                        "xdata":$('#'+mains+'')[0].dataset.gsX,"ydata":$('#'+mains+'')[0].dataset.gsY,"width":$('#'+mains+'')[0].dataset.gsWidth,
                        "height":$('#'+mains+'')[0].dataset.gsHeight,"addtype":optionss[i].addtype,"textcontent":textcontent};
                    chartlocationInfos.push(chartlocationInfo);
                }
            }
            $.ajax({
                url: SERVER_URL + "/visualization/report/saveChartlocationInfos",    //请求的url地址
                dataType: "json",   //返回格式为json
                async: false,//请求是否异步，默认为异步，这也是ajax重要特性
                data:{jsonString :JSON.stringify({"chartlocationInfos":chartlocationInfos})},
                type: "post",   //请求方式
                success: function (result) {
                    layer.msg($.i18n.prop('success'), {
                        offset: '60px',anim: 5,icon: 1,skin:'winning-class'});
                    saveflag=true;
                    return;
                },
                complete: function () {

                },
                error: function (result) {
                    console.info(result);
                }
            });
        },
        complete: function () {

        },
        error: function (result) {
            console.info(result);
        }
    });

});
}
function createMenu(){
    $.ajax({
        url: SERVER_URL + "/visualization/report/selectChartlocationInfosByCond",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data:{"cond.reportid":reportid},
        type: "post",   //请求方式
        success: function (result) {
            var chartlocationInfos = result.chartlocationInfos;
            if(chartlocationInfos){
                var widgets=[];
                var optionjson = '';
                for(var i=0;i<chartlocationInfos.length;i++){
                    widgets.push({
                        x: chartlocationInfos[i].xdata,
                        y:  chartlocationInfos[i].ydata,
                        width: chartlocationInfos[i].width,
                        height: chartlocationInfos[i].height,
                        auto_position: false
                    });
                    if(chartlocationInfos[i].options == ''){
                        optionss.push({"chartid":chartlocationInfos[i].chartid
                            ,"visualizationid":chartlocationInfos[i].visualizationid,"addtype":chartlocationInfos[i].addtype,
                            "textcontent":chartlocationInfos[i].textcontent});
                    }else{
                        optionss.push({"option":JSON.parse(chartlocationInfos[i].options),"chartid":chartlocationInfos[i].chartid
                            ,"visualizationid":chartlocationInfos[i].visualizationid,"addtype":chartlocationInfos[i].addtype,
                            "textcontent":chartlocationInfos[i].textcontent});
                    }
                    // optionss.push({"option":JSON.parse(chartlocationInfos[i].options),"chartid":chartlocationInfos[i].chartid
                    //     ,"visualizationid":chartlocationInfos[i].visualizationid,"addtype":chartlocationInfos[i].addtype,
                    //     "textcontent":chartlocationInfos[i].textcontent});
                }
                click=1;
                var controller = new Controller(widgets);
                ko.applyBindings(controller);
            }
        },
        complete: function () {

        },
        error: function (result) {
            console.info(result);
        }
    });
}
function toPermission() {
	if(!reportid||reportid==''){
		 layer.msg($.i18n.prop('savereport'), {
			offset: '60px',anim: 5,icon: 0,skin:'winning-class'});
		return;
	}
	layer.open({
		type: 2,
		title: $.i18n.prop('permissionlist'),
		area: ['1100px', '95%'],
		shade: 0.8,
		closeBtn: 1,
		shadeClose: true,
		content: 'permission.html?reportid='+reportid,
	});
}
	
function toChart() {
	var shareContent = document.querySelector("#content");
	var width = shareContent.offsetWidth;
	var height = shareContent.offsetHeight;
	var canvas = document.createElement("canvas");
	var scale = 2;

	canvas.width = width * scale;
	canvas.height = height * scale;
	canvas.getContext("2d").scale(scale, scale);

	var opts = {
		scale: scale,
		canvas: canvas,
		logging: true,
		width: width,
		height: height,
		useCORS: true // 【重要】开启跨域配置
	};
	html2canvas(shareContent, opts).then(function (canvas) {
		var context = canvas.getContext('2d');
		document.getElementById("contents").setAttribute("style","display:none");
		document.getElementById("img").setAttribute("style","");
		document.getElementById("contanier1").setAttribute("style","display:none");
		document.getElementById("contanier2").setAttribute("style","");
		// 【重要】关闭抗锯齿
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;
		var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height);
		document.getElementById("img").innerHTML='';
		document.getElementById("img").appendChild(img);
		$(img).css({
			"width": canvas.width / 2 + "px",
			"height": canvas.height / 2 + "px",
		}).addClass('f-full');
	});

}

function toBack() {
	document.getElementById("contanier1").setAttribute("style","");
	document.getElementById("contanier2").setAttribute("style","display:none");
	document.getElementById("contents").setAttribute("style","");
	document.getElementById("img").setAttribute("style","display:none");
}