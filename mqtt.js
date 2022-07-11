var mqtt = require('mqtt');  
var exec = require('child_process').exec;
const schedule = require('node-schedule');
var qiniu = require("qiniu");
var images = require("images");
var client2 = mqtt.connect("mqtt://124.222.132.138:1883");   //指定服务端地址和端口
var fs = require('fs');
client2.subscribe('test',{qos:1});//订阅主题为test的消息   
var appkey = '82hegw5u8epkx';
// 替换成您自己的 Secret
var secret = 'KhBxcxO8k71G';
var logFile = "log.txt"
var mqttFile ="mqttlog.txt"
var cmdFile ="cmdfile.txt"
var servercmdFile ="servercmdFile.txt"

var accessKey = 'juyd7w78ZDeQJ5s4nERR6ZCAY38y2obNtRJPYi5t';
var secretKey = 'ZeXHiIthxicrNlRzy2PUkJY3xCxGTFuiWbnR83M9';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var sendImageName ="dd.jpg";
var baseCdnUrl = "http://cdn.openpl.cn/"

Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "S": this.getMilliseconds() //毫秒 
    };    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));    for (var k in o)        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));    return fmt;
}

function getToday() {    
	return new Date().Format("yyyy-MM-dd hh:mm:ss")
}

function getTodayDate() {    
	return new Date().Format("yyyy_MM_dd")
}

function getTodayHours() {    
	return new Date().Format("hh")
}


//var excuSystemCmd = require("./SystemCmd")
//excuSystemCmd.exculog()
//发送im消息
function sendImMessage(message){
	var RongSDK = require('rongcloud-sdk')({
	    appkey: appkey,
	    secret: secret
	});

	var Message = RongSDK.Message;
	var Private = Message.Private;
	Private.send(message).then(result => {
		log("rongim:"+JSON.stringify(result))
	}, error => {
		log(JSON.stringify("rongim:"+error.toString()))
	});
}

function sendFile(){
	 console.log("upload----> start");
	var options = {
 	 scope: 'myphoto'
	}
	var putPolicy = new qiniu.rs.PutPolicy(options);
	var uploadToken=putPolicy.uploadToken(mac);
	console.log(uploadToken);

	var config = new qiniu.conf.Config();
	// 空间对应的机房
	config.zone = qiniu.zone.Zone_z0;

	var localFile = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/dd.jpg";
	/*images(localFile)
	.save(
		localFile,
		{
			 quality : 50
	});*/
	var formUploader = new qiniu.form_up.FormUploader(config);
	var putExtra = new qiniu.form_up.PutExtra();
	var key=getTodayDate()+"_"+new Date().getTime()+"to.jpg";
	// 文件上传
	formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
	  respBody, respInfo) {
	  if (respErr) {
	    throw respErr;
	  }
	  if (respInfo.statusCode == 200) {
	    console.log("upload---->"+respBody);
	    var message = {
				senderId: 'mac',
				targetId: 'huawei',
				objectName: 'RC:ImgMsg',
				content: {
					 "content": imageBase64,
			   		 "imageUri": baseCdnUrl+key,
			    	 "extra": "附加信息"
				}
			};
			console.log("upload ---->"+baseCdnUrl+key)
		    sendImMessage(message)
	  } else {
	    console.log("upload---->err: "+respInfo.statusCode);
	    console.log("upload---->err:"+respBody);
	  }
	});
}


function sendImageToQiniu(){
	excuCustomCmd("/bin/sh  /Users/jtzhtc_pengjiajia/PycharmProjects/untitled/util/Scheduled.sh")
	setTimeout(function(){
			console.log('------延迟开始执行上传------')
			var options = {
		 	 scope: 'myphoto'
			}
			var putPolicy = new qiniu.rs.PutPolicy(options);
			var uploadToken=putPolicy.uploadToken(mac);
			console.log(uploadToken);

			var config = new qiniu.conf.Config();
			// 空间对应的机房
			config.zone = qiniu.zone.Zone_z0;

			var localFile = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/dd.png";
			var compresfile = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/dd2.png";
			var formUploader = new qiniu.form_up.FormUploader(config);
			var putExtra = new qiniu.form_up.PutExtra();
			sendImageName=getTodayDate()+"_"+new Date().getTime()+".jpg";
			var imageData = fs.readFileSync(compresfile); // 例：fileUrl="D:\\test\\test.bmp"
			var imageBase64 = imageData.toString("base64");
			// 文件上传
			formUploader.putFile(uploadToken, sendImageName, localFile, putExtra, function(respErr,
				  respBody, respInfo) {
				  if (respErr) {
				    throw respErr;
				  }
				  if (respInfo.statusCode == 200) {
				    console.log("qiniu:"+respBody);
				    var message = {
						senderId: 'mac',
						targetId: 'huawei',
						objectName: 'RC:ImgMsg',
						content: {
							 "content":imageBase64,
					   		 "imageUri": baseCdnUrl+sendImageName,
					    	 "extra": "附加信息"
						}
					};
					console.log("qiniu :"+baseCdnUrl+sendImageName)
				    sendImMessage(message)

				  } else {
				    console.log("qiniu error:"+respInfo.statusCode);
				    console.log(respBody);
				  }
			});
			
	//延迟一秒执行
	},5000);

	

}

function sleep(time,cmd) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        excuSystemCmd(cmd)
      }, time);
    })
  }

function excuCustomCmd(cmd){
	console.log("---->"+cmd)
	exec(cmd, function(error, stdout, stderr) {
		console.log(stdout+"\t"+error+"\t"+stderr)
	  // 获取命令执行的输出
	});
}

//执行系统命令
function excuSystemCmd(cmd){
	var cmds = cmd.split(",")
	/*if(cmds[1] == undefined){
		console.log("1没有暂停时间！！！")
		return;
	}
	else if(cmds[1].trim() ==""){
		console.log("没有暂停时间！！！")
		return;
	}else{
		console.log(" time --->"+cmds[0]+cmds[1])
	}*/
	console.log(" excue --->"+cmds[0]+"\t"+cmds[1])
	if(cmds[0].startsWith("Send")){
		sendImageToQiniu();
		return;
	}
	exec(cmds[0], function(error, stdout, stderr) {
		console.log(stdout+"\t"+error+"\t"+stderr)
	  // 获取命令执行的输出
	});
}

function log(logStr){
	console.log(logStr)
	/*fs.writeFile(logFile, logStr+"\t"+getToday()+"\n", { 'flag': 'a' }, function(err) {
	    if (err) {
	        throw err;
	    }
	});*/
}

//读取命令文件
function readCmdFile(){
	console.log("start to read cmd file :")
	const readline = require("readline")
	let rl = readline.createInterface({
  		input: fs.createReadStream(cmdFile)
	})
	var time1=0;

	rl.on('line', line => {
	  if(line.indexOf("#") == 0){
	  	log('注释命令，不需要执行'+line)
	  }else{
	  	//console.log(line)
	  	//excuSystemCmd(line)
	  	var cmds = line.split(",")
		if(cmds[1] == undefined){
			console.log("1没有暂停时间！！！")
			return;
		}
		else if(cmds[1].trim() ==""){
			console.log("没有暂停时间！！！")
			return;
		}else{
			//console.log(" time --->"+cmds[0]+cmds[1])
			time1 =time1+Number(cmds[1])
			sleep(time1,line)
		}
	  }
	})
	//sendImageToQiniu();
}


//读取命令文件
function readServerCmdFile(){
	console.log("start to read  servercmd file :")
	const readline = require("readline")
	let rl = readline.createInterface({
  		input: fs.createReadStream(servercmdFile)
	})
	var time1=0;

	rl.on('line', line => {
	  if(line.indexOf("#") == 0){
	  	log('注释命令，不需要执行'+line)
	  }else{
	  	//console.log(line)
	  	//excuSystemCmd(line)
	  	var cmds = line.split(",")
		if(cmds[1] == undefined){
			console.log("1没有暂停时间！！！")
			return;
		}
		else if(cmds[1].trim() ==""){
			console.log("没有暂停时间！！！")
			return;
		}else{
			//console.log(" time --->"+cmds[0]+cmds[1])
			time1 =time1+Number(cmds[1])
			sleep(time1,line)
		}
	  }
	})
}

//解析服务器命令
function parseServerCmd(servercmd){
	var message ={}
	if(servercmd.indexOf("adb") == 0){
		excuCustomCmd(servercmd);
		message = {
				senderId: 'mac',
				targetId: 'huawei',
				objectName: 'RC:TxtMsg',
				content: {
					content: "执行命令"+servercmd
				}
			};
			sendImMessage(message);
		return;
	}
	switch(servercmd){
		//执行命令
		case "1":
			message = {
				senderId: 'mac',
				targetId: 'huawei',
				objectName: 'RC:TxtMsg',
				content: {
					content: "收到命令，开始执行！！！"+getToday()
				}
			};
			readCmdFile()
		break;
		//状态检测
		case "2":
			message = {
				senderId: 'mac',
				targetId: 'huawei',
				objectName: 'RC:TxtMsg',
				content: {
					content: "当前状态！！！"+getToday()
				}
			};
		break;
		//回传图片
		case "photo":
			readServerCmdFile();
		return;
		//默认回传消息
		default:
			message = {
				senderId: 'mac',
				targetId: 'huawei',
				objectName: 'RC:TxtMsg',
				content: {
					content: servercmd
				}
			};
	}
	sendImMessage(message);
}

client2.on('message',function(top,message) {  
    console.log(message.toString());  
    // 写入文件内容（如果文件不存在会创建一个文件）
	// 传递了追加参数 { 'flag': 'a' }
	/*fs.writeFile(mqttFile, message.toString()+"\t"+getToday()+"\n", { 'flag': 'a' }, function(err) {
	    if (err) {
	        throw err;
	    }
	});*/
	parseServerCmd(message.toString())
	
});  
/*
let rule = new schedule.RecurrenceRule();
	//rule.date = [1];//每月1号
	//rule.dayOfWeek = [1,3,5];每周一、周三、周五
	//rule.hour = [0,12]; // 每天0点和12点开始推送
	rule.minute = [0,5,10,15,20,25,30,35,40,45,50,55]; // 每隔 5 分钟执行一次
	rule.second = 0;//每分钟的0秒执行
let job = schedule.scheduleJob(rule, () => {
  log(getToday());
});
*/
let ruleHour = new schedule.RecurrenceRule();
	//rule.date = [1];//每月1号
	ruleHour.dayOfWeek = [1,2,3,4,5];
	ruleHour.hour = [0,8,20,22]; // 每天0点和12点开始推送
	ruleHour.minute = 0; // 每隔 5 分钟执行一次
	ruleHour.second = 0;//每分钟的0秒执行
let job2 = schedule.scheduleJob(ruleHour, () => {
  log(getToday());
  message = {
				senderId: 'mac',
				targetId: 'huawei',
				objectName: 'RC:TxtMsg',
				content: {
					content: "nodejs schedule task start "
				}
			};
  sendImMessage(message);
});

/*
var localFile = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/dd.jpg";
	images(localFile)
	.save(
		localFile,
		{
			 quality : 50
	});*/




