"use strict"

var bencode = require("bencode");

var dgram = require("dgram");


class Testsok {
	test() {
		this.address = "127.0.0.1";
		this.port = "10005";
		
		this.socket = dgram.createSocket("udp4");
		this.socket.on('error', (err)=>{
			console.error("socket error:\n ");
			this.socket.close();
		});
		this.socket.on('message', (packet, rinfo)=>this.onMessage(packet, rinfo));
		this.socket.once('listening', ()=>this.start());
		
		this.socket.bind(this.port, this.address);
	}
	
	onMessage(packet, rinfo) {
		console.log("in onMessage");
		
		var tmp_ip = rinfo.address;
		var tmp_port = rinfo.port;
		console.log(packet.toString());
		console.log(rinfo);
		//this.socket.send("okokok");
		
		this.socket.send("okokok", 0, 4, tmp_port, tmp_ip);
	}
	
	start() {
		console.log("in start");
		
		
	}
	
	
	
}

module.exports = Testsok;
