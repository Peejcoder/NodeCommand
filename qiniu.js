var qiniu = require("qiniu");

var accessKey = 'juyd7w78ZDeQJ5s4nERR6ZCAY38y2obNtRJPYi5t';
var secretKey = 'ZeXHiIthxicrNlRzy2PUkJY3xCxGTFuiWbnR83M9';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


var options = {
  scope: 'myphoto'
}
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);
console.log(uploadToken);

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

var localFile = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/timg.jpeg";
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var key='timg.jpeg';
// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});

