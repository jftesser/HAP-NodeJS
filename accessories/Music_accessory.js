var control = require("./control.js");

var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;
var err = null; // in case there were any problems

// here's a fake hardware device that we'll expose to HomeKit
var MUSIC = {
    setPowerOn: function(on) {
    console.log("Turning the music %s!...", on ? "on" : "off");
    if (on) {
          if(err) { return console.log(err); }
          console.log("...music is now on.");
          control.sendCommand("apple_music");
    }

    MUSIC.powerOn = false;
  },
    identify: function() {
    console.log("Identify the music.");
    }
}

// Generate a consistent UUID for our music Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the accessory name.
var musicUUID = uuid.generate('hap-nodejs:accessories:Music');

// This is the Accessory that we'll return to HAP-NodeJS that represents our fake light.
var music = exports.accessory = new Accessory('Outlet', musicUUID);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
music.username = "1A:2B:3C:4D:5D:FF";
music.pincode = "031-45-154";

// set some basic properties (these values are arbitrary and setting them is optional)
music
  .getService(Service.AccessoryInformation)
  .setCharacteristic(Characteristic.Manufacturer, "Oltica")
  .setCharacteristic(Characteristic.Model, "Rev-1")
  .setCharacteristic(Characteristic.SerialNumber, "A1S2NASF88EW");

// listen for the "identify" event for this Accessory
music.on('identify', function(paired, callback) {
  MUSIC.identify();
  callback(); // success
});

// Add the actual music Service and listen for change events from iOS.
// We can see the complete list of Services and Characteristics in `lib/gen/HomeKitTypes.js`
music
  .addService(Service.Outlet, "Music") // services exposed to the user should have "names" like "Fake Light" for us
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    MUSIC.setPowerOn(value);
    callback(); // Our fake Outlet is synchronous - this value has been successfully set
  });

// We want to intercept requests for our current power state so we can query the hardware itself instead of
// allowing HAP-NodeJS to return the cached Characteristic.value.
music
  .getService(Service.Outlet)
  .getCharacteristic(Characteristic.On)
  .on('get', function(callback) {

    // this event is emitted when you ask Siri directly whether your light is on or not. you might query
    // the light hardware itself to find this out, then call the callback. But if you take longer than a
    // few seconds to respond, Siri will give up.

    var err = null; // in case there were any problems

    if (MUSIC.powerOn) {
      console.log("Are we on? Yes.");
      callback(err, true);
    }
    else {
      console.log("Are we on? No.");
      callback(err, false);
    }
  }); 
