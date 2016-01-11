// HomeKit types required
var types = require("./types.js")
var exports = module.exports = {};

var execute = function(accessory,characteristic,value){ console.log("executed accessory: " + accessory + ", and characteristic: " + characteristic + ", with value: " +  value + "."); }

exports.accessory = {
  displayName: "Channel",
  username: "CA:3E:BC:4D:5E:FF",
  pincode: "031-45-154",
  services: [{
    sType: types.ACCESSORY_INFORMATION_STYPE, 
    characteristics: [{
      cType: types.NAME_CTYPE, 
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "Channel",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Bla",
      designedMaxLength: 255    
    },{
      cType: types.MANUFACTURER_CTYPE, 
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "Oltica",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Bla",
      designedMaxLength: 255    
    },{
      cType: types.MODEL_CTYPE,
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "Rev-1",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Bla",
      designedMaxLength: 255    
    },{
      cType: types.SERIAL_NUMBER_CTYPE, 
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "A1S2NASF88EW",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Bla",
      designedMaxLength: 255    
    },{
      cType: types.IDENTIFY_CTYPE, 
      onUpdate: null,
      perms: ["pw"],
      format: "bool",
      initialValue: false,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Identify Accessory",
      designedMaxLength: 1    
    }]
  },{
    sType: types.THERMOSTAT_STYPE, 
    characteristics: [{
      cType: types.NAME_CTYPE,
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "Channel",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Bla",
      designedMaxLength: 255   
    },{
      cType: types.CURRENTHEATINGCOOLING_CTYPE,
      onUpdate: function(value) { console.log("Change:",value); execute("Channel", "Current HC", value); },
      perms: ["pr","ev"],
      format: "int",
      initialValue: 3,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Current Mode",
      designedMaxLength: 1,
      designedMinValue: 0,
      designedMaxValue: 2,
      designedMinStep: 1,    
    },{
      cType: types.TARGETHEATINGCOOLING_CTYPE,
      onUpdate: function(value) { console.log("Change:",value); execute("Channel", "Target HC", value); },
      perms: ["pw","pr","ev"],
      format: "int",
      initialValue: 3,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Target Mode",
      designedMinValue: 0,
      designedMaxValue: 3,
      designedMinStep: 1,
    },{
      cType: types.CURRENT_TEMPERATURE_CTYPE,
      onUpdate: function(value) { console.log("Change:",value); execute("Channel", "Current Temperature", value); },
      onRead: function(callback) {
        console.log("resetting current");
        callback(20); // reset!
      },
      perms: ["pr","ev"],
      format: "int",
      initialValue: 20,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Current Temperature",
      unit: "fahrenheit"
    },{
      cType: types.TARGET_TEMPERATURE_CTYPE,
      onUpdate: function(value) { console.log("Change:",value); execute("Channel", "Target Temperature", value); },
      onRead: function(callback) {
        console.log("resetting target");
        callback(20); // reset!
      },
      perms: ["pw","pr","ev"],
      format: "int",
      initialValue: 20,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Target Temperature",
      designedMinValue: 16,
      designedMaxValue: 38,
      designedMinStep: 1,
      unit: "fahrenheit"
    },{
      cType: types.TEMPERATURE_UNITS_CTYPE,
      onUpdate: function(value) { console.log("Change:",value); execute("Channel", "Unit", value); },
      perms: ["pr","ev"],
      format: "int",
      initialValue: 1,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Unit"
    }]
  }]
}