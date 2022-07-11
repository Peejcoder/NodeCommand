
var exec = require('child_process').exec;

function excuCmd(){
	var cmd = 'adb devices';

	exec(cmd, function(error, stdout, stderr) {
		console.log(stdout)
	  // 获取命令执行的输出
	});
}

exports.exculog= function (){
	console.log("执行日志！")
}

