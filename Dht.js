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
		
		this.socket.on('message', function(packet, rinfo) {
			_self.onMessage(packet, rinfo, _self);
		});
		this.socket.once('listening', function() {
			_self.start(_self);
		});
		
		this.socket.bind(this.port, this.address);
		
		this.findNodes(_self);
	}
	
	onMessage(packet, rinfo, _self) {		
		console.log("in onMessage"+rinfo);
		var t="";
		var y="";	
		var msg=null;
		
		try {
			msg = bencode.decode(packet);
		}catch(ee) {
			console.log("message err");
			msg = null;
		}
		
//		console.log("[[[[[[[[[[[[[[[[");
//		console.log(msg);
//		console.log(rinfo);
//		console.log("]]]]]]]]]]]]]]]]");
		
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
						console.log("nodeS len"+nodes.length);						
						_self.insertNode(nodes);
						
					}
					else {
						console.log(msg);
					}
//					console.log(msg);
				}
				else if(y == 'q' ) {
					var q = msg.q.toString();	
					console.log(msg);
					switch(q) {
					case 'ping':
						_self.toPing(msg, rinfo);
						break;
					case 'find_node':
						_self.toFindNode(msg, rinfo);
						break;
					case 'get_peers':
						_self.toGetPeer(msg, rinfo);
						break;
					case 'annouce_peer':
						_self.toAnnouncePeer(msg, rinfo);
						break;					
					default:
//						console.log(msg);
					}					
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
		console.log("inserthahah");		
	}
	
	start(_self) {
		console.log("in start");
		this.joinDht(_self);
	}
	
	joinDht(_self) {
		var superNodes = config.superNodes;
		for(var i=0; i < superNodes.length; i++) {
			this.findNode(superNodes[i], _self.id);
		}		
	}
	
	findNodes(_self) {
		var tmp_count = 0;
		var tmp_handle_check = setInterval(function() {			
			var tmp_node_unit = _self.data_router.getNodeToReq();
			_self.data_router.showData();
			if(tmp_node_unit != null) {
				var tmp_node = tmp_node_unit.getNode();
				if(tmp_node != null && tmp_node.nid != undefined) {
//					console.log(tmp_node);
					_self.findNode(tmp_node, _self.id);
					
					tmp_count ++;
				}	
			}
			else {
				if(tmp_count > 0){
					_self.joinDht(_self);
				}
			}
			
			if(tmp_count > 1) {
//				clearInterval(tmp_handle_check);
			}
		}, 2000);
	}
	
	findNode(target, nid) {
        //生成离目标节点较近的id		
    	const id = nid != undefined ? utils.genNeighborId(nid, this.id) : this.id;
//		const id = nid;
		if(id == undefined) {
			id = this.id;
		}
		
    	const msg = {
     	   t: crypto.randomBytes(2),
            y: 'q',
            q: 'find_node',
            a: {
                id:id,
                target: utils.randomId()
//                target:id
            }
    	};
    	
//    	console.log("<<<<<<<<<<<<<");
//    	console.log(target);
//    	console.log(nid);
//    	console.log(msg);
//    	console.log(">>>>>>>>>>>>>");
        this.request(msg, target); 
	}
	
	
	toPing(msg, rinfo) {
		const r = {
	            id: this.id
	        };    
		this.response(r, msg.t, rinfo);
	}
	
	toFindNode(msg, rinfo) {		
		var tmp_nodes_near = this.data_router.getNearNodes(this.id);
		tmp_nodes_near = bencode.decode(tmp_nodes_near);
		const r = {
	            id: this.id,
	            nodes:tmp_nodes_near
	        };    
		this.response(r, msg.t, rinfo);
	}
	
	toGetPeer(msg, rinfo) {
		//ADD TO DB
		var info_hash = msg.a.info_hash;
		if(info_hash && info_hash.length == 20) {
			//add to db
			var tmp_nodes_near = this.data_router.getNearNodes(info_hash);
			tmp_nodes_near = bencode.decode(tmp_nodes_near);
			const r = {
//		            id: this.id,
					id:utils.genNeighborId(info_hash, this.id),
		            token: crypto.randomBytes(4),
		            nodes: tmp_nodes_near
		        };
			this.response(r, msg.t, rinfo);
		}		
	}
	
	toAnnouncePeer(msg, rinfo) {
		//ADD TO DB
		
		 const r = {
		            id: this.id
		        };

		this.response(r, msg.t, rinfo);
	}
		
	
	request(msg, target) {
//		console.log(msg);
    	const address = target.address;
        const port = target.port;
        const packet = bencode.encode(msg);
        const len = packet.length;
        
//        console.log(target);
        this.socket.send(packet, 0, len, port, address);
	}
	
	 response(r, t, rinfo) {
        const packet = bencode.encode({
            t,
            r,
            y: 'r'
        });
        const len = packet.length;
        const address = rinfo.address;
        const port = rinfo.port;
        if (port < 1 || port > 65535) {
            console.log('port is invalid');
            return ;
        }

        
        this.socket.send(packet, 0, len, port, address);
	}
	
}

module.exports = Dht;
