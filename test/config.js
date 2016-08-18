module.exports = {
//    address: '104.207.153.197',
	address: '0.0.0.0',
    port: 5663,
    superNodes: [{
    	address: 'router.utorrent.com',
    	port: 6881
    }, {
    	address: 'router.bittorrent.com',	
    	port: 6881
    }, {
    	address: 'dht.transmissionbt.com',
    	port: 6881
    }],
    db: 'mongodb://localhost/dht',
    // request周期，越小越快，单位ms
    cycleTimes: 0,
    
    dbinfo: {
    	host:'localhost',
    	user:'root',
    	psw:'a123456b',
    	db:'ndt'
    }
}