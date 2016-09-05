var CC2540SensorTag = require('./cc2540');
var CC2650SensorTag = require('./cc2650');
var CdifDevice = require('cdif-device');
var util = require('util');

var SensorTag = function(bleDevice) {
  var spec = null;
  if (CC2540SensorTag.is(peripheral)) {
    spec = require('./cc2540.json');
  } else if (CC2650SensorTag.is(peripheral)) {
    spec = require('./cc2650.json');
  }
  CdifDevice.call(this, spec);
  this.device = bleDevice;
  this.actions['urn:cdif-net:serviceId:Illuminance']['getIlluminance'] = getYeelightBlueState.bind(this);
  this.actions['urn:cdif-net:serviceId:Temperature']['getTemperature'] = setYeelightBlueState.bind(this);
  this.actions['urn:cdif-net:serviceId:Humidity']['getHumidity'] = getYeelightBlueBrightness.bind(this);
  this.actions['urn:cdif-net:serviceId:Accelerometer']['getAccelerometer'] = setYeelightBlueBrightness.bind(this);
  this.actions['urn:cdif-net:serviceId:Magnetometer']['getMagnetometer'] = getYeelightBlueColor.bind(this);
  this.actions['urn:cdif-net:serviceId:Barometer']['getBarometer'] = setYeelightBlueColor.bind(this);
  this.actions['urn:cdif-net:serviceId:Gyroscope']['getGyroscope'] = setYeelightBlueColor.bind(this);
};

util.inherits(SensorTag, CdifDevice);

SensorTag.is = function(peripheral) {
  return (CC2540SensorTag.is(peripheral) || CC2650SensorTag.is(peripheral));
};

// SensorTag.discoverAll = function(onDiscover) {
//   CC2540SensorTag.discoverAll(onDiscover);
//   CC2650SensorTag.discoverAll(onDiscover);
// };
//
// SensorTag.stopDiscoverAll = function(onDiscover) {
//   CC2540SensorTag.stopDiscoverAll(onDiscover);
//   CC2650SensorTag.stopDiscoverAll(onDiscover);
// };
//
// SensorTag.discover = function(callback) {
//   var onDiscover = function(sensorTag) {
//     SensorTag.stopDiscoverAll(onDiscover);
//
//     callback(sensorTag);
//   };
//
//   SensorTag.discoverAll(onDiscover);
// };
//
// SensorTag.discoverByAddress = function(address, callback) {
//   address = address.toLowerCase();
//
//   var onDiscoverByAddress = function(sensorTag) {
//     if (sensorTag._peripheral.address === address) {
//       SensorTag.stopDiscoverAll(onDiscoverByAddress);
//
//       callback(sensorTag);
//     }
//   };
//
//   SensorTag.discoverAll(onDiscoverByAddress);
// };
//
// SensorTag.discoverById = function(id, callback) {
//   var onDiscoverById = function(sensorTag) {
//     if (sensorTag.id === id) {
//       SensorTag.stopDiscoverAll(onDiscoverById);
//
//       callback(sensorTag);
//     }
//   };
//
//   SensorTag.discoverAll(onDiscoverById);
// };
//
// // deprecated
// SensorTag.discoverByUuid = function(uuid, callback) {
//   var onDiscoverByUuid = function(sensorTag) {
//     if (sensorTag.uuid === uuid) {
//       SensorTag.stopDiscoverAll(onDiscoverByUuid);
//
//       callback(sensorTag);
//     }
//   };
//
//   SensorTag.discoverAll(onDiscoverByUuid);
// };

SensorTag.CC2540 = CC2540SensorTag;
SensorTag.CC2650 = CC2650SensorTag;

module.exports = SensorTag;
