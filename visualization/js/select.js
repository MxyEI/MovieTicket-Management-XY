function GetRequest(url) {
    var url = url; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[i]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function getJsonData(){
	$.ajax({
			url: SERVER_URL+"/visualization/visualization/selectClassifications",
			type: "post",
			async:false,
			dataType:"json",
			data:{},
			success: function(data){
				dataarr = data.classificationInfos;
			},
			error: function()
			{
			}
		}
	);
};
function selectOnchang(obj){ 
//获取被选中的option标签选项 
	if(obj.selectedIndex==1){
		getJsonData();				
		var div="<label for=\"name\"  >"+$.i18n.prop('selecttype')+"</label><select id=\"editable-select\" class=\"editSelect\" name=\"classificationname\">";
		for(var i=0;i<dataarr.length;i++){
			div+="<option value="+dataarr[i].classificationid+">"+dataarr[i].name+"</option>";
		}
		$("#result").append(div+"</select>");
		$('#editable-select').editableSelect({
			bg_iframe: false,
			case_sensitive: false,
			items_then_scroll: 10,
			isFilter: false
		});
	
	}else{
		$("#result").html('');
	}
}
  
function getUrl() {
	var url;
	var t = $('#sqlform').serializeArray();
	$.each(t, function() {
		if(this.name == 'type') {
			var type = this.value;
			url = 'visualization.html';
			
		}

	});
	$.each(t, function() {
		if(this.name == 'sourcename') {
			url += "?" + this.name + "=" + this.value;
		}
		if(this.name == 'classificationname'){
			url += "&" + this.name + "=" +encodeURI(encodeURI(this.value));
		}
		if(this.name == 'type') {
			url += "&" + this.name + "=" + this.value;
		}
	});
	return url;
};
/**
 * 预览
 */
function show() {
	var sourcename=$("#selectpicker").val();
	var xfield=encodeURI(encodeURI($("#xfield").val()));
	var yfield=encodeURI(encodeURI($("#yfield").val()));
	var yfield2='';
	if($("#chartype").val()=='k' || $("#chartype").val()=='heatmap'){
		yfield2=encodeURI(encodeURI($("#yfield2").val()));
	}
	if(sourcename=='---请选择---'||sourcename=='---choose---'||xfield==null||yfield==null){
		alert($.i18n.prop('selectconfigure'));
		return;
	}
	var url = getUrl();
	url += "&classificationid=" + classificationid+"&xfield="+xfield+"&yfield="+yfield+"&yfield2="+yfield2+"&sourceType="+sourceType+"&builtinconditions="+encodeURI($("#builtinconditions").val());
	$("#content").css("display", "");
	$("#iframe").attr('src', url);
};
/**
 * 
 */
function selecttypeOnchang(obj){
    document.getElementById("ydescribe2").setAttribute("style","display:none");
    if(obj.value=='radar'){
        $("#xdescribe").text($.i18n.prop('classification'));
        $("#ydescribe").text($.i18n.prop('value'));
        $("#yfield").attr("multiple","multiple");
        $('#yfield').multiselect("rebuild");
    }else if(obj.value == 'heatmap') {
    	$("#xdescribe").text($.i18n.prop('week'));
		$("#ydescribe").text($.i18n.prop('timepoint'));
		$("#yaxis2").text($.i18n.prop('duration'));
		$("#yfield").removeAttr("multiple");
		$('#yfield').multiselect("rebuild");
		document.getElementById("ydescribe2").setAttribute("style","");
    }else{
        $("#xdescribe").text($.i18n.prop('xaxis'));
        $("#ydescribe").text($.i18n.prop('yaxis'));
        if(obj.value=='k' ){
            $("#ydescribe").text($.i18n.prop('minimum'));
            //（K线图）变为单选在重建
            $("#yfield").removeAttr("multiple");
            $('#yfield').multiselect("rebuild");
            document.getElementById("ydescribe2").setAttribute("style","")
        }else if(obj.value=='map' || obj.value=='pie' ||obj.value=='funnel' || obj.value=='rose'){
        	$("#yfield").removeAttr("multiple");
        	$('#yfield').multiselect("rebuild");
        }else {
            $("#yfield").attr("multiple","multiple");
            $('#yfield').multiselect("rebuild");
        }
    }
	$(".multiselect-search").attr('placeholder',$.i18n.prop('search'));

}
