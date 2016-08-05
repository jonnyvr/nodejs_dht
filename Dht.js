"use strict"

var bencode = require("bencode");
var crypto = require("crypto");
var dgram = require("dgram");

var config = require("./config");
var utils = require("./utils");

class Dht {
	test() {
		this.address = "127.0.0.1";
		this.port = "8004";
		this.id = utils.randomId();
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
	}
	
	start() {
		console.log("in start");
		this.joinDht();
		
	}
	
	joinDht() {
		const superNodes = config.superNodes;		
		superNodes.forEach((v) => this.findNode(v));
	}
	
	findNode(target, nid) {
        //生成离目标节点较近的id		
        const id = nid != undefined ? utils.genNeighborId(nid, this.id) : this.id;
        const msg = {
            t: crypto.randomBytes(2),
            y: 'q',
            q: 'find_node',
            a: {
                id,
                target: utils.randomId()
            }
        };
        
        this.request(msg, target); 
	}
	
	request(msg, target) {
		console.log(msg);
        const address = target.address;
        const port = target.port;
        const packet = bencode.encode(msg);
        const len = packet.length;
        this.socket.send(packet, 0, len, port, address);
	}
	
}

module.exports = Dht;
