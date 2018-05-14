var manageurl = getRootPath();
var SERVER_URL = 'http://localhost:8001';
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
    if(projectName == '/movieticket-management-xy'){
        return(projectName);
    }else{
        return("");
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


function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires="
        + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function checkCookie() {
    if (getCookie("manage_username") == null || getCookie("manage_id") == null) {
        alert("未登录!");
        window.location.href = "login.html";
    }
}

function clearCookie() {
    delCookie("manage_username");
    delCookie("manage_id");
    window.location.href = "login.html";
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function StringBuffer() {
    this.__strings__ = new Array;
}

StringBuffer.prototype.append = function(str) {
    this.__strings__.push(str);
    return this;
};

StringBuffer.prototype.toString = function() {
    return this.__strings__.join("");
};

function getQueryStringByName(name) {
    var result = location.search.match(new RegExp(
        "[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};

function isNull(id) {
    if (id == null || (typeof (id) == "string" && id.trim().length == 0)) {
        return true;
    }
    return false;
}

function isNotNull(id) {
    return !isNull(id);
}