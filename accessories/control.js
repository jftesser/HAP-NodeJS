"use strict";
var xhr = require('./xhr');
var serial = require("./serial.js")
// functions for controlling artichoke and ir blaster
var exports = module.exports = {};


// hue stuff
var bridge_ip = "10.0.1.2";
var user_name = "3754f5d763aa2cd2c55d70f468e5e28";

var getBridgeIP = function() {
	var ret = xhr({url: 'https://www.meethue.com/api/nupnp'});
	console.log(ret);
  return ret
      .then(JSON.parse.bind(JSON))
      .then(function(resp){
        for (var i=0; i < resp.length; i++) {
          if (resp[i].id == "001788fffe2284d7") bridge_ip = resp[i].internalipaddress;
        }
      });
};

var turnOffArtichoke = function(){
	console.log("trying to turn off artichoke blah");
	getBridgeIP().then(function(){
        xhr({
			verb: 'PUT',
			url: 'http://'+bridge_ip+'/api/'+user_name+'/lights/3/state',
			data: JSON.stringify({
			on: false
			})
	    });
    });

};

exports.setAntenna = function() {
	console.log("setAntenna");
	turnOffArtichoke();
	serial.send("tv");
};

exports.setAppleTV = function() {
	console.log("setAppleTV");
	turnOffArtichoke();
	serial.send("appletv");
};

exports.channelUp = function() {
	console.log("channelUp");
	serial.send("channel_up");
};

exports.channelDown = function() {
	console.log("channelDown");
	serial.send("channel_down");
};

exports.setTurntable = function() {
	console.log("setTurntable");
	serial.send("turntable");
};

exports.volumeUp = function() {
	console.log("volumeUp");
	serial.send("volume_up");
};

exports.volumeDown = function() {
	console.log("volumeDown");
	serial.send("volume_down");
};

exports.setXbox = function() {
	console.log("setXbox");
	turnOffArtichoke();
	serial.send("xbox");
};