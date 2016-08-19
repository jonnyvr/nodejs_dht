var http = require("http");


var tmp_str = "04e1de5846d47b6c487c6ca77782918c02ca0903";


tmp_str = tmp_str.toUpperCase();

var tmp_str_rtn = "http://bt.box.n0808.com/"+tmp_str.substr(0, 2)+"/"+tmp_str.substr(-2)+"/"+tmp_str+".torrent";

var tmp_option = {
	host:"bt.box.n0808.com",
	path:"/"+tmp_str.substr(0, 2)+"/"+tmp_str.substr(-2)+"/"+tmp_str+".torrent",
	method:"get",
	headers:{
//		"Referer":"http://www.sandai.net",
		"User-Agent":"Mozilla/5.0"
	}
	
};


var tmp_req = http.request(tmp_option, function(res) {
	res.setEncoding("utf8");
	res.on("data",function(data) {
		console.log("ttt");
		console.log(data);
	});
});
//console.log(tmp_str_rtn);
tmp_req.end();