"use strict"

class NodesBucket {
	
	constructor(selfNodeId, N) {
		this._selfNodeId = selfNodeId;
		if(typeof(N) != 'number') {
			this._N = 8;
		}
		else {
			if(N > 8 || N <= 0) {
				N = 8;
			}
			this._N = N;
		}
	}
	
	
	test() {
		console.log("in test"+this._selfNodeId+"   ___  " +this._N);
		
	}
	
	
}

module.exports = NodesBucket;