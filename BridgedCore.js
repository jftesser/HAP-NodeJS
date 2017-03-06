var fs = require('fs');
var path = require('path');
var storage = require('node-persist');
var uuid = require('./').uuid;
var Bridge = require('./').Bridge;
var Accessory = require('./').Accessory;
var accessoryLoader = require('./lib/AccessoryLoader');

console.log("HAP-NodeJS starting...");

// Initialize our storage system
storage.initSync();

// Start by creating our Bridge which will host all loaded Accessories
var bridge = new Bridge('Main Screen', uuid.generate("Main Screen"));

// Listen for bridge identification event
bridge.on('identify', function(paired, callback) {
  console.log("Node Bridge identify");
  callback(); // success
});

// Load up all accessories in the /accessories folder
var dir = path.join(__dirname, "accessories");
var accessories = accessoryLoader.loadDirectory(dir);

var toggle_characteristics = [];
var updown_characteristics = [];

for (var i=0; i<accessories.length; i++){
//console.log(accessories[i].services);
	for (var j=0; j<accessories[i].services.length; j++){
		var toggle_pair = {target:null,current:null};
		var updown_pair = {target:null,current:null};
		for (var k=0;k < accessories[i].services[j].characteristics.length; k++){
			
			if (accessories[i].services[j].characteristics[k].displayName.indexOf('Target State') > -1) {
				toggle_pair.target = accessories[i].services[j].characteristics[k];
			}
			if (accessories[i].services[j].characteristics[k].displayName.indexOf('Current State') > -1) {
				toggle_pair.current = accessories[i].services[j].characteristics[k];
			}

			if (accessories[i].services[j].characteristics[k].displayName.indexOf('Target Temperature') > -1) {
				updown_pair.target = accessories[i].services[j].characteristics[k];
			}
			if (accessories[i].services[j].characteristics[k].displayName.indexOf('Current Temperature') > -1) {
				updown_pair.current = accessories[i].services[j].characteristics[k];
			}
		}
		if (toggle_pair.target != null && toggle_pair.current != null) toggle_characteristics.push(toggle_pair);
		if (updown_pair.target != null && updown_pair.current != null) updown_characteristics.push(updown_pair);
	}
}

toggle_characteristics.forEach(function(cpair) {
	cpair.current.on('set', function(value, callback) {
		if (value == 0) { // why do target and current seem to be opposites??
			console.log("turned on "+cpair.current.displayName);

			// and everything else is off
			toggle_characteristics.forEach(function(other_cpair) {
				if (other_cpair != cpair) {
					other_cpair.target.setValue(0);
				}
			});
		} else {
			// this is being turned off...if everything else is off too we should turn power off
		}
	});

	cpair.target.on('set', function(value, callback) {
		if (value == 0) cpair.current.setValue(1);
		if (value == 1) cpair.current.setValue(0);
	});
});

// this is just not working at all
updown_characteristics.forEach(function(cpair) {
	cpair.current.on('set', function(value, callback) {
		console.log(value);
	});

	cpair.target.on('set', function(value, callback) {
		console.log(value);
		if (value < 20) {
			console.log("down!");
		} else if (value > 20) {
			console.log("up!");
		} else {
			return;
		}
		//cpair.target.setValue(20);
		//cpair.current.setValue(20); // reset always!
	});
});

// Add them all to the bridge
accessories.forEach(function(accessory) {
  bridge.addBridgedAccessory(accessory);
});

// Publish the Bridge on the local network.
bridge.publish({
  username: "CC:22:3D:E3:C5:F8",
  port: 51826,
  pincode: "031-45-154",
  category: Accessory.Categories.BRIDGE
});
