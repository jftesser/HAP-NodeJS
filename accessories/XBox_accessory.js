var control = require("./control.js");
// HomeKit types required
var types = require("./types.js");
var exports = module.exports = {};

var execute = function(accessory,characteristic,value) {
  console.log("executed accessory: " + accessory + ", and characteristic: " + characteristic + ", with value: " +  value + "."); 
};

var xBox_target_val = undefined;
var xBox_current_val = undefined;

exports.accessory = {
  displayName: "XBox",
  username: "3C:5A:3D:EE:5E:FA",
  pincode: "031-45-154",
  services: [{
    sType: types.ACCESSORY_INFORMATION_STYPE, 
    characteristics: [{
      cType: types.NAME_CTYPE, 
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "XBox",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Name of the accessory",
      designedMaxLength: 255    
    },{
      cType: types.MANUFACTURER_CTYPE, 
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "Oltica",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Manufacturer",
      designedMaxLength: 255    
    },{
      cType: types.MODEL_CTYPE,
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "Rev-1",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Model",
      designedMaxLength: 255    
    },{
      cType: types.SERIAL_NUMBER_CTYPE, 
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "A1S2NASF88EW",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "SN",
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
    sType: types.GARAGE_DOOR_OPENER_STYPE, 
    characteristics: [{
      cType: types.NAME_CTYPE,
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: "XBox",
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Name of service",
      designedMaxLength: 255   
    },{
      cType: types.CURRENT_DOOR_STATE_CTYPE,
      onUpdate: function(value) { 
        console.log("Change:",value); 
        execute("XBox", "Current State", value); 
        xBox_current_val = value;
      },
      onRead: function(callback) {
        console.log("Read:");
        execute("XBox", "Current State", null);
        callback(xBox_current_val); // only testing, we have no physical device to read from
      },
      perms: ["pr","ev"],
      format: "int",
      initialValue: 0,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "XBox Current State",
      designedMinValue: 0,
      designedMaxValue: 1,
      designedMinStep: 1,
      designedMaxLength: 1    
    },{
      cType: types.TARGET_DOORSTATE_CTYPE,
      onUpdate: function(value) { 
        console.log("Change:",value); 
        xBox_target_val = value;
        execute("XBox", "Target State", value); 
        if (value == 1)
          control.setXbox();
      },
      onRead: function(callback) {
        console.log("Read:");
        execute("XBox", "Target State", null);
        callback(xBox_target_val); // only testing, we have no physical device to read from
      },
      perms: ["pr","pw","ev"],
      format: "int",
      initialValue: 0,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "XBox Target State",
      designedMinValue: 0,
      designedMaxValue: 1,
      designedMinStep: 1,
      designedMaxLength: 1    
    },{
      cType: types.OBSTRUCTION_DETECTED_CTYPE,
      onUpdate: function(value) { 
        console.log("Change:",value); 
        execute("XBox", "Obstruction", value); 
      },
      onRead: function(callback) {
        console.log("Read:");
        execute("XBox", "Obstruction", null);
        callback(undefined); // only testing, we have no physical device to read from
      },
      perms: ["pr","ev"],
      format: "bool",
      initialValue: false,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "XBox Obstruction"
    }]
  }]
}