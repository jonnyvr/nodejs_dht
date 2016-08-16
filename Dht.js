"use strict"

var bencode = require("bencode");
var crypto = require("crypto");
var dgram = require("dgram");

var config = require("./config");
var utils = require("./utils");
var NodesBucket = require("./NodesBucket");
var NodeUnit = require("./NodeUnit");


class Dht {	
	test() {		
		var _self = this;		
		this.address = "104.207.153.197";
		this.port = "8004";
		this.id = utils.randomId();
		this.selfNode = new NodeUnit(this.id);
		this.data_router = new NodesBucket(this.selfNode);
		
		//console.log(this.id);
		//return ;
		this.socket = dgram.createSocket("udp4");
		this.socket.on('error', (err)=>{
			console.error("socket error:\n ");
			this.socket.close();
		});
		
		this.socket.on('message', function(packet) {
			_self.onMessage(packet, _self);
		});
		this.socket.once('listening', ()=>this.start());
		
		this.socket.bind(this.port, this.address);
		
		this.findNodes(_self);
	}
	
	onMessage(packet, _self) {		
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
						_self.insertNode(nodes);
						
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
	
	insertNode(nodes) {
		if(nodes.length > 0) {
//			console.log("in for1");
			for(var j=0; j < nodes.length; j++) {
//				console.log("in for2");
				var tmp_node_new = nodes[j];
				
				var tmp_node_unit = new NodeUnit();
				tmp_node_unit.setNode(tmp_node_new);
				this.data_router.insertNewNode(tmp_node_unit);				
			}							
		}
		else {
			console.log("dddddddd");
		}
//		console.log(data_router);
	}
	
	start() {
		console.log("in start");
		this.joinDht();
		
		
		
	}
	
	joinDht() {
		var superNodes = config.superNodes;		
		superNodes.forEach((v) => this.findNode(v));
	}
	
	findNodes(_self) {
		setInterval(function() {			
			var tmp_node_unit = _self.data_router.getNodeToReq();
			if(tmp_node_unit != null) {
				var tmp_node = tmp_node_unit.getNode();
				if(tmp_node != null && tmp_node.nid != undefined) {
					findNode(tmp_node.nid, _self.id);
				}	
			}
						
		}, 100);
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
