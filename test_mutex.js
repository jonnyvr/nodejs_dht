"use strict"

var EventEmitter = require('events');

var myevent = new EventEmitter();

var data = [];
var i= 0;

data.push("www");
class My_class {
	
	constructor() {
		this._dd= "ddd";
		console.log("in My_class");
	}
	
	test2() {
		console.log("in test2");
	}
	
	test() {
		myevent.addListener('testevent', function(tmp_param) {
			//console.log('on event'+data);
			i++;
			data.push(i);
			//console.log(data + tmp_param);
			console.log(data.length > 0);
			console.log(data.length);
			console.log(data);
			
			
			var count = 10000000;
			while((count=count-2) > 0) {
				count++;		
			}
//			count = 10000000;
//			while((count=count-2) > 0) {
//				count++;		
//			}
//			count = 10000000;
//			while((count=count-2) > 0) {
//				count++;		
//			}
//			count = 10000000;
//			while((count=count-2) > 0) {
//				count++;		
//			}
//			count = 10000000;
//			while((count=count-2) > 0) {
//				count++;		
//			}
//			count = 10000000;
//			while((count=count-2) > 0) {
//				count++;		
//			}
//			
			
			
		});


		var timeId = setInterval(function() {
			
//			if(i > 100) {
				clearInterval(timeId);
//			}
			myevent.emit('testevent', "time1");
		}, 1);

//		var timeId2 = setInterval(function() {
//			myevent.emit('testevent', "time2");
//			if(i > 100) {
//				clearInterval(timeId2);
//			}
//		}, 1);
//
//		var timeId3 = setInterval(function() {
//			myevent.emit('testevent', "time3");
//			if(i > 100) {
//				clearInterval(timeId3);
//			}
//		}, 1);
//
//		var timeId4 = setInterval(function() {
//			myevent.emit('testevent', "time4");
//			if(i > 100) {
//				clearInterval(timeId4);
//			}
//		}, 1);
//
//
//		var timeId5 = setInterval(function() {
//			
//			if(i > 100) {
//				clearInterval(timeId5);
//				console.log(data);
//			}
//		}, 1);
//
//		var timeId6 = setInterval(function() {	
//			if(i > 100) {
//				clearInterval(timeId6);		
//			}
//			else {
//				console.log(i);
//				data.pop();	
//			}
//		}, 1); 
	}
}


var myclass = new My_class();
myclass.test();



