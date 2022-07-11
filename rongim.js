//替换成您自己的 Appkey
var appkey = '82hegw5u8epkx';
// 替换成您自己的 Secret
var secret = 'KhBxcxO8k71G';

var RongSDK = require('rongcloud-sdk')({
    appkey: appkey,
    secret: secret
});

// API 文档: http://www.rongcloud.cn/docs/server/sdk/user/user.html#register
/*var User = RongSDK.User;
var user = {
	id: 'ujadk90ha',
	name: 'Maritn',
	portrait: 'http://7xogjk.com1.z0.glb.clouddn.com/IuDkFprSQ1493563384017406982'
};
User.register(user).then(result => {
	console.log(result);
}, error => {
	console.log(error);
});*/


var Message = RongSDK.Message;
var Private = Message.Private;

// API 文档: http://www.rongcloud.cn/docs/server_sdk_api/message/private.html#send
var message = {
	senderId: 'mac',
	targetId: 'huawei',
	objectName: 'RC:TxtMsg',
	content: {
		content: '开始执行！！！'
	}
};
var messageimage = {
	senderId: 'mac',
	targetId: 'huawei',
	objectName: 'RC:ImgMsg',
	content: {
		 "content": "iVBORw0KGgoAAAAN...5ErkJggg==",
   		 "imageUri": "http://www.rongcloud.cn/avatar.jpg",
    	"extra": "附加信息"
	}
};
Private.send(message).then(result => {
	console.log(result);
}, error => {
	console.log(error);
});
Private.send(messageimage).then(result => {
	console.log(result);
}, error => {
	console.log(error);
});


function sendImTxtMessage(){
	var RongSDK = require('rongcloud-sdk')({
	    appkey: appkey,
	    secret: secret
	});

	var Message = RongSDK.Message;
	var Private = Message.Private;
	var message = {
		senderId: 'mac',
		targetId: 'huawei',
		objectName: 'RC:TxtMsg',
		content: {
			content: '开始执行！！！'
		}
	};
	Private.send(message).then(result => {
		console.log(result);
		log(result)
	}, error => {
		console.log(error);
		log(error)
	});
}

function sendImImageMessage(){
	var RongSDK = require('rongcloud-sdk')({
	    appkey: appkey,
	    secret: secret
	});
	var Message = RongSDK.Message;
	var Private = Message.Private;
	var messageimage = {
		senderId: 'mac',
		targetId: 'huawei',
		objectName: 'RC:ImgMsg',
		content: {
			 "content": "iVBORw0KGgoAAAAN...5ErkJggg==",
	   		 "imageUri": "http://www.rongcloud.cn/avatar.jpg",
	    	 "extra": "附加信息"
		}
	};
	Private.send(messageimage).then(result => {
		console.log(result);
		log(result)
	}, error => {
		console.log(error);
		log(error)
	});
}

