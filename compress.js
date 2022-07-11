var images = require("images");
var localFile = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/dd.png";
var localFile1 = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/dd1.png";
	/*images(localFile)
	.save(
		localFile1,
		{
			 quality : 50
	});*/
const imagemin = require('imagemin');
const imageminMozjpeg  = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
/*
imagemin(localFile, {
        destination: localFile1,
	// 这里的 destination 使用图片原有路径
	// 如果使用新的路径，则不会影响原图片，而是在新路径下保存压缩后的图片
	// 想要保留压缩前后的两份图片，可以使用这种方式
        plugins: [
	  // 压缩 jpg 格式
          imageminPngquant({
            quality: [0.6, 0.7]  //压缩质量（0,1）
        })
	  // 压缩 png 格式
          //imageminPngquant()
        ]
      }).then(() => {
    console.log("压缩成功");
}).catch(err => {
    console.log("压缩失败："+err)
});*/
/*
imagemin([localFile], {
    destination: localFile1, 
    plugins: [
        imageminPngquant()
    ]
}).then(() => {
    console.log("压缩成功");
})*/

/*
var spawn = require('child_process').spawn;

var args = [
  'dd.png',
  '\\(','dd1.png','-resize','10x10','\\)',
  '-gravity', 'center',
  '-composite', '-'
];

var ls = spawn('convert',args);
ls.stderr.on('data', function (data) {
   console.log('stderr: ' + data);
});
*/

/**
 * Created by ZXW on 2017/10/30.
 */
var test = "/Users/jtzhtc_pengjiajia/NodeProject/RongIm/timg.jpeg";
var fs = require('fs');
var  gm = require('gm').subClass({imageMagick: true});;
 
gm(test).resize(500);
/*
gm(localFile)
    .resize(50, 50,"!")
    .write(localFile1, function (err) {
        if (!err) console.log('done')
        	else{
        		console.log(err)
        	};
    });
    */
/*
var convert = spawn('convert',[localFile,'-resize','100x100','-']);
convert.stderr.pipe(process.stderr);*/