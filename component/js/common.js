// var SERVER_URL = getRootPath();
var SERVER_URL = 'http://localhost:8080';
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
    if(projectName == '/resource'){
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