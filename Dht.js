"use strict"

var bencode = require("bencode");
var crypto = require("crypto");
var dgram = require("dgram");

var config = require("./config");
var utils = require("./utils");

var data_router = [];

class Dht {
	test() {		
		this.address = "104.207.153.197";
		this.port = "8004";
		this.id = utils.randomId();
		//console.log(this.id);
		//return ;
		this.socket = dgram.createSocket("udp4");
		this.socket.on('error', (err)=>{
			console.error("socket error:\n ");
			this.socket.close();
		});
		var _self = this;
		console.log(_self);	
		this.socket.on('message', function(packet) {
			_self.onMessage(packet, _self);
		});
		this.socket.once('listening', ()=>this.start());
		
		this.socket.bind(this.port, this.address);
	}
	
	onMessage(packet, _self) {		
		console.log(_self);		
		console.log("in onMessage");
		var t="";
		var y="";	
		var msg=null;
		
		try {
			msg = bencode.decode(packet);
		}catch(ee) {
			console.log("message err");
			msg = null;
		}
		
		if(msg != null) {
			if(msg.y) {
				y = msg.y.toString();
			}
			if(msg.t) {
				t= msg.t.toString();
			}
			if(y != '' && t != '') {		
				if(y == 'r') {					
					if(msg.r.token) {
			            if(msg.r.values) {
							
						}
						else if(msg.r.nodes) {
							
						}
						else {
							
						}
					}
					else if(msg.r.nodes) {						
						var nodes = utils.decodeNodes(msg.r.nodes);
//						console.log("node len"+nodes.length);
						
						if(nodes.length > 0) {
//							console.log("in for1");
							for(var j=0; j < nodes.length; j++) {
//								console.log("in for2");
								var tmp_node_new = nodes[j];
								var tmp_is_in = false;
								
//								console.log("in for");
								for(var i=0; i < data_router.length; i++) {
									var tmp_node_old = data_router[i];
									if(tmp_node_new.nid == tmp_node_old.nid) {
										tmp_is_in = true;
										break;
									}									
								}
								
//								console.log("node in"+tmp_is_in);
								if(!tmp_is_in) {
									data_router.push(tmp_node_new);
								}
							}							
						}
						else {
//							console.log("dddddddd");
						}
//						console.log(data_router);
						
					}
					else {
						console.log(msg);
					}
				}
				else if(y == 'q' ) {
					console.log(msg);
				}
				else {	
					console.log(msg);
				}
			}
		}
	}	
	
	
	start() {
		console.log("in start");
		this.joinDht();
		
		
		
	}
	
	joinDht() {
		var superNodes = config.superNodes;		
		superNodes.forEach((v) => this.findNode(v));
	}
	
	findNodes() {
		
	}
	
	findNode(target, nid) {
        //生成离目标节点较近的id		
    	const id = nid != undefined ? utils.genNeighborId(nid, this.id) : this.id;
    	const msg = {
     	   t: crypto.randomBytes(2),
            y: 'q',
            q: 'find_node',
            a: {
                id:id,
                //target: utils.randomId()
                target:id
            }
    	};
    
        this.request(msg, target); 
	}
	
	request(msg, target) {
//		console.log(msg);
    	const address = target.address;
        const port = target.port;
        const packet = bencode.encode(msg);
        const len = packet.length;
        this.socket.send(packet, 0, len, port, address);
	}
	
}

module.exports = Dht;
