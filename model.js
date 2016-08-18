"use strict"
var Mysql = require("mysql");
var config = require("./config");

class DB {
	constructor() {
		var dbinfo = config.dbinfo;;
		this._dbinfo = dbinfo;
		this._conn = mysql.createConnection({
			host: dbinfo.host, 
			user: dbinfo.user,
			password: dbinfo.psw
		}); 
		
		install() {
			
		}
		
		insert_infohash(tmp_info_hash) {
			if(tmp_info_hash != undefined) {
				tmp_info_hash = trim(tmp_info_hash);
			}
			if(tmp_info_hash != '') {
				this._conn.query("insert into ndt.info_hashs(info_hash, upTime) values('"+tmp_info_hash+"', now())", function(err, rows, fields) {
					if(err) {
						
					}
					else {
						
					}	
				});	
			}			
		}
		
		
	}
	
	
	
}




var tmp_conn = mysql.createConnection({
	host: "localhost", 
	user: "root",
	password: "a123456b"
}); 

tmp_conn.connect();

tmp_conn.query("select 1", function(err, rows, fields) {
	if(err) {
		
	}
	else {
		
	}
//	console.log(rows[0].solution);
	
//	setTimeout(function() {
		console.log(fields);
		
//	}, 2000);
});

console.log("end");

tmp_conn.end();
