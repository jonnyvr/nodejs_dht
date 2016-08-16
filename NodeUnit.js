"use strict"

class NodeUnit {
	constructor(selfNodeId) {
		this._nodeId = selfNodeId;
		this._upTime = "";
		this._hasRequest = false;
		
		this._node = null;
	}
	
	setNode(tmp_node) {
		if(tmp_node != null && tmp_node.nid != undefined) {
			this._nodeId = tmp_node.nid;
			this._node = tmp_node;
		}
	}
	
	getNode() {
		return this._node;
	}
		
	refreshTime() {
		this._upTime = new Date().getTime();
	}
}

module.exports = NodeUnit;