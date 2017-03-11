var control = require("./control.js");

var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var err = null; // in case there were any problems

// here's a fake hardware device that we'll expose to HomeKit
var TV = {
    setPowerOn: function(on) {
    console.log("Turning the tv %s!...", on ? "on" : "off");
    if (!on) {
          if(err) { return console.log(err); }
          console.log("...tv is now off.");
          control.sendCommand("off");
    }

    TV.powerOn = true; // setting back to on automatically for now
  },
  identify: function() {
  console.log("Identify the tv.");
  },
  powerOn: true
}

// Generate a consistent UUID for our tv Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the accessory name.
var tvUUID = uuid.generate('hap-nodejs:accessories:TV');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var tv = exports.accessory = new Accessory('Outlet', tvUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
tv.username = "1A:2B:3C:4D:5D:FF";
tv.pincode = "031-45-154";

// set some basic properties (these values are arbitrary and setting them is optional)
tv
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "Oltica")
  .setCharacteristic(Characteristic.Model, "Rev-1")
  .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");

// listen for the "identify" event for this Accessory
tv.on('identify', function(paired, callback) {
  TV.identify();
  callback(); // success
});

// Add the actual tv Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
tv
  .addService(Service.Outlet, "TV") // services exposed to the user should have "names" like "Fake Light" for us
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    TV.setPowerOn(value);
    callback(); // Our fake Outlet is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
tv
  .getService(Service.Outlet)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {

    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.

    var err = null; // in case there were any problems

    if (TV.powerOn) {
      console.log("Are we on? Yes.");
      callback(err, true);
    }
    else {
      console.log("Are we on? No.");
      callback(err, false);
    }
  }); 
