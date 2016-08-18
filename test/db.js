"use strict"
var mysql = require("mysql");
var config = require("./config");

class DB {
	constructor() {
		var dbinfo = config.dbinfo;;
		this._self = this;
		this._dbinfo = dbinfo;
		this._conn = mysql.createConnection({
			host: dbinfo.host, 
			user: dbinfo.user,
			password: dbinfo.psw
		});
		
		
	}
	
	install() {
		
	}
	
	recordInfohash(tmp_info_hash, tmp_from) {
		console.log("in recordInfohash");
		var _self = this._self;
		if(tmp_from == undefined) {
			tmp_from = "";
		}
		else {
			tmp_from = tmp_from.trim();
		}
		if(tmp_info_hash != undefined) {
			
			var tmp_conn = this._conn;
			this._conn.query("insert into ndt.info_hashs(info_hash, datafrom, upTime) values('"+tmp_info_hash+"','"+tmp_from+"', now())", function(err, rows, fields) {
				if(err) {
					
					console.log("insert into ndt.info_hashs(info_hash, datafrom, upTime) values('"+tmp_info_hash+"','"+tmp_from+"', now())");
				}
				else {					
					tmp_conn.end();
				}	
			});
		}
	}
	
	updateInfohashStatus(tmp_info_hash) {
		console.log("in updateInfohashStatus");
		var _self = this._self;
		if(tmp_info_hash != undefined) {
			
			var tmp_conn = this._conn;
			this._conn.query("update ndt.info_hashs set hasAnnouncePeer=1 where info_hash='"+tmp_info_hash+"'", function(err, rows, fields) {
				if(err) {
					
				}
				else {
					
					tmp_conn.end();
				}	
			});
		}
	}
	
	recordUnKnowPack(tmp_data) {
		console.log("in recordUnKnowPack");
		if(tmp_data != undefined) {
			var tmp_conn = this._conn;
			this._conn.query("insert into ndt.unresolve_pack(data, upTime) values('"+tmp_data+"', now())", function(err, rows, fields) {
				if(err) {
					
				}
				else {
					
					tmp_conn.end();
				}	
			});
		}
	}
}

module.exports = DB;