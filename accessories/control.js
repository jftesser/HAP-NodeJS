"use strict";
var xhr = require('./xhr');
// functions for talking to the main server
var exports = module.exports = {};

var server_address = 'http://10.0.1.66:8888'; //'http://mainscreenturnon.local:8888'

exports.sendCommand = function(command) {
	console.log("sending "+command+" to the server");

	var ret = xhr({
		verb: 'PUT',
		url: server_address+'/state',
		data: { mode: command },
		urlencoded: true
	});

	ret.then(function(resp){
        console.log(resp);
    },function(error){
    	console.error(error);
    });
};

