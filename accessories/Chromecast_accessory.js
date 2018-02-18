var control = require("./control.js");

var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var err = null; // in case there were any problems

// here's a fake hardware device that we'll expose to HomeKit
var Chromecast = {
    setPowerOn: function(on) {
    console.log("Turning the chromecast %s!...", on ? "on" : "off");
    if (on) {
          if(err) { return console.log(err); }
          console.log("...chromecast is now on.");
          control.sendCommand("chromecast");
    }

    Chromecast.powerOn = false;
  },
    identify: function() {
    console.log("Identify the chromecast.");
    }
}

// Generate a consistent UUID for our chromecast Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the accessory name.
var chromecastUUID = uuid.generate('hap-nodejs:accessories:Chromecast');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var chromecast = exports.accessory = new Accessory('Outlet', chromecastUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
chromecast.username = "1A:2B:3C:4D:5D:FF";
chromecast.pincode = "031-45-154";

// set some basic properties (these values are arbitrary and setting them is optional)
chromecast
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "Oltica")
  .setCharacteristic(Characteristic.Model, "Rev-1")
  .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");

// listen for the "identify" event for this Accessory
chromecast.on('identify', function(paired, callback) {
  Chromecast.identify();
  callback(); // success
});

// Add the actual chromecast Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
chromecast
  .addService(Service.Outlet, "Chromecast") // services exposed to the user should have "names" like "Fake Light" for us
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    Chromecast.setPowerOn(value);
    callback(); // Our fake Outlet is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
chromecast
  .getService(Service.Outlet)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {

    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.

    var err = null; // in case there were any problems

    if (Chromecast.powerOn) {
      console.log("Are we on? Yes.");
      callback(err, true);
    }
    else {
      console.log("Are we on? No.");
      callback(err, false);
    }
  }); 
