//require('express');

//var tmp_buf = new Buffer(20);
//
//
//tmp_buf.fill(0);
//tmp_buf[3] = 0xdd;
//console.log(tmp_buf);
//return ;
//console.log(144000000000000000<<16);
//return ;
//var NodesBucket = require("./NodesBucket");
//
//var nodesBucket = new NodesBucket("bucket1", 3);
//nodesBucket.test();
//return;
//
////var Testsok = require("./Testsok");
////var testsok = new Testsok();
////testsok.test();
//return;


//var DB = require("./db");
//
//var db = new DB();
////db.recordUnKnowPack("oookkk");
////db.recordInfohash("oookkk", "from1");
//db.recordInfohash("oookkk");
//return;

var Dht = require("./Dht");
var dht = new Dht();
dht.init();


return ;
var http = require('http');
var tt = require("./TestModule");
require('express');


var ttt = new tt();
ttt.say();


return;
http.createServer(function (request, response) {

	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	response.writeHead(200, {'Content-Type': 'text/plain'});

	// 发送响应数据 "Hello World"
	response.end('Hello World1\n'+ttt.say());
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');


