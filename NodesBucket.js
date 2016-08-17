"use strict"
var HashMap = require("hashmap").HashMap;
var NodeUnit = require("./NodeUnit");

class NodesBucket {
	
	constructor(selfNode, N) {
		this._data = new HashMap();
		this._selfNode = selfNode;
		this._bucketIndex = [];		
		
		if(typeof(N) != 'number') {
			this._N = 8;
		}
		else {
			if(N > 8 || N <= 0) {
				N = 8;
			}
			this._N = N;
		}
		
		for(var i=0; i < 160; i++) {
			if(i >= 3) {
				this._bucketIndex.push(Math.pow(2, i));
			}
		}
	}
	
	showData() {
//		console.log(this._data.values());
		console.log("<<<<<<<<<<<<<<<<<<<<<<<<<");
		var tmp_count = this._data.count();
		console.log(tmp_count );
		var tmp_vs = this._data.values();
		
		for(var i=0; i< tmp_vs.length; i++) {
			tmp_count += tmp_vs[i].length;
		}
		console.log(tmp_count );
//		console.log(tmp_vs);
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
	}
	
	calDis(srcNode, targetNode) {
		var tmp_dis_rtn = -1;
		
		if(targetNode != null && targetNode._nodeId != undefined && srcNode != null && srcNode._nodeId != undefined) {
			if(targetNode._nodeId.length != undefined && srcNode._nodeId.length != undefined && srcNode._nodeId.length == 20) {
				var tmp_dis_arr = [];
				for(var i=0; i < 20; i++) {
					tmp_dis_arr.push(targetNode._nodeId[i] ^ srcNode._nodeId[i]);
				}
				var tmp_dis = 0.0;
				for(var i=0; i < 20; i++) {
					tmp_dis += tmp_dis_arr[i]<<(8*(19-i));
				}
				
				console.log(this._data);
				console.log(srcNode._nodeId);
				console.log(targetNode._nodeId);
//				console.log(tmp_dis_arr);
				
				console.log("tmp_dis"+tmp_dis+ "_");
				
				for(var i=0; i < this._bucketIndex.length; i ++) {
					var tmp_find = false;
					if(i == 0) {
						if(tmp_dis < this._bucketIndex[i]) {
							tmp_dis_rtn = i;
							tmp_find= true;						
						}
					}
					
					if(!tmp_find) {
						if(i == (this._bucketIndex.length-1)) {
							if(tmp_dis > this._bucketIndex[i]) {
								tmp_dis_rtn = i;
								tmp_find= true;						
							}
						}
					}
					
					if(!tmp_find) {
						if(tmp_dis >= this._bucketIndex[i] && tmp_dis < this._bucketIndex[i+1]) {
							tmp_dis_rtn = i;
							tmp_find= true;
						}										
					}
					
					if(tmp_find) {
						break;
					}
				}
			}	
		}
		return tmp_dis_rtn;
	}
	
	
	getNearNodes(targetNodeId) {
		var tmp_nodes_rtn = [];
		if(targetNodeId != null && targetNodeId != undefined) {
			var tmp_target_node_unit = new NodeUnit(targetNodeId);
			var tmp_dis = this.calDis(this._selfNode, tmp_target_node_unit);
			if(this._data.has(tmp_dis)) {
				var tmp_units = this._data.get(tmp_dis);
				if(tmp_units != null && tmp_units.length > 0) {
					for(var i=tmp_units.length-1; i >= 0; i++ ) {
						var tmp_node_unit =tmp_units[i];
						if(tmp_node_unit != null && tmp_node_unit != undefined  && tmp_node_unit._node != null && tmp_node_unit._node != undefined) {
							tmp_nodes_rtn.push(tmp_node_unit._node);
						}
					}
				}
			}	
		}
		return tmp_nodes_rtn;
	}
	
	
	insertNewNode(targetNode) {
		if(targetNode != null && targetNode._nodeId != undefined) {
			var tmp_dis = this.calDis(this._selfNode, targetNode)
//			console.log("tmp_dis: "+tmp_dis);
			targetNode.refreshTime();
			
			if(!this._data.has(tmp_dis)) {
				this._data.set(tmp_dis, []);
				this._data.get(tmp_dis).push(targetNode);
			}
			else {
				var tmp_hash_data = this._data.get(tmp_dis);
				var tmp_node_hasin_index = -1;
				if(tmp_hash_data.length > 0) {
					var has_in = false;
					for(var i=0; i < tmp_hash_data.length; i++) {
						var tmp_node_unit = tmp_hash_data[i];
						if(tmp_node_unit._nodeId == targetNode._nodeId) {
							has_in = true;
							tmp_node_hasin =tmp_node_unit; 
							break;
						}
					}					
					
					if(!has_in) {
						if(tmp_hash_data.length >= this._N) {
							this._data.get(tmp_dis).shift();
							this._data.get(tmp_dis).push(targetNode);
						}
						else {
							this._data.get(tmp_dis).push(targetNode);
						}
					}
					else {
						if(tmp_node_hasin_index >= 0) {
							
							
						}
					}
				}
				else {
					this._data.get(tmp_dis).push(targetNode);
				}
			}
			
		}
	}
	
	getNodeToReq() {
		var tmp_node_rtn = null;
		if(this._data.count() > 0) {
			var tmp_vs = this._data.values();		
			
			for(var i=0; i < tmp_vs.length; i++) {
				var tmp_nodes = tmp_vs[i];				
				if(typeof(tmp_nodes) === 'object') {
					for(var j=0; j < tmp_nodes.length; j++) {
						var tmp_node = tmp_nodes[j];
						if(tmp_node._nodeId != undefined) {
							if(tmp_node._hasRequest === false) {
								tmp_node._hasRequest = true;
								tmp_node_rtn = tmp_node;
								
//								console.log(tmp_node_rtn);
								break;
							}
						}
					}
				}
			}
//			console.log(tmp_vs);
		} 
		return tmp_node_rtn;
	}
	
	test() {
//		console.log("in test"+this._selfNodeId+"   ___  " +this._N);
//		console.log(this._data);
//		
//		var node = new NodeUnit();		
//		console.log(node._upTime);
		
		// 1111 1001
		//
		
		
		//var tmp_var = 15 ^ 9;
//		console.log(tmp_var);
//		console.log(Math.sqrt(8));
		//console.log(15 >> 2);
		
		var tmp_var = 0x01;
		this._selfNode = new NodeUnit();
//		this._selfNode._nodeId = 0xd54033cd939d192a75ed7bc99e3dc1d0436e1dfa;
//		this._selfNode._nodeId = 0xd54033cd;
		this._selfNode._nodeId = [0xd5, 0x40, 0x33, 0x11];
		
//		console.log(this._bucketIndex);
		
		var tmp_node = new NodeUnit();
		tmp_node._nodeId = 222;
		
		var tmp_node1 = new NodeUnit();
		tmp_node1._nodeId = 322;
		
		var tmp_node2 = new NodeUnit();
		tmp_node2._nodeId = 422;
		
		var tmp_node3 = new NodeUnit();
//		tmp_node3._nodeId = 0x07f29b9630707160328b053b1aa772e779a4714b;
//		tmp_node3._nodeId = 0x07f29b96;
		tmp_node3._nodeId = [0x07, 0xf2, 0x33, 0x11];
		
		
		
//		this.insertNewNode(tmp_node);
//		this.insertNewNode(tmp_node1);
//		this.insertNewNode(tmp_node2);
		this.insertNewNode(tmp_node3);
//		console.log(this._data.count());
//		console.log(this._data);
//		console.log(this.getNodeToReq());
		
		
		
	}	
}

module.exports = NodesBucket;