var CC2540SensorTag = require('./cc2540');
var CC2650SensorTag = require('./cc2650');
var CdifDevice = require('cdif-device');
var util = require('util');

var SensorTag = function(bleDevice) {
  var spec = null;
  var peripheral = bleDevice._peripheral;
  var isCC2650 = CC2650SensorTag.is(peripheral);

  if (isCC2650) {
    spec = require('./cc2650.json');
    this.sensorTag = new CC2650SensorTag(peripheral);
  } else {
    spec = require('./cc2540.json');
    this.sensorTag = new CC2540SensorTag(peripheral);
  }
  CdifDevice.call(this, spec);
  this.device = bleDevice;
  this.sensorTag.device = bleDevice;

  var service;
  if (isCC2650) {
    this.setAction('urn:cdif-net:serviceID:Illuminance', 'getIlluminanceData', getLuxometerData);
    this.setSubscriber('urn:cdif-net:serviceID:Illuminance', subscribeLuxometerEvent, onLuxometerEvent);
    this.setUnsubscriber('urn:cdif-net:serviceID:Illuminance', unsubscribeLuxometerEvent);
  }
  this.setAction('urn:cdif-net:serviceID:Temperature', 'getTemperatureData', getTemperatureData);
  this.setSubscriber('urn:cdif-net:serviceID:Temperature', subscribeTemperatureEvent, onTemperatureEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Temperature', unsubscribeTemperatureEvent);

  this.setAction('urn:cdif-net:serviceID:Accelerometer', 'getAccelerometerData', getAccelerometerData);
  this.setSubscriber('urn:cdif-net:serviceID:Accelerometer', subscribeAccelerometerEvent, onAccelerometerEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Accelerometer', unsubscribeAccelerometerEvent);

  this.setAction('urn:cdif-net:serviceID:Humidity', 'getHumidityData', getHumidityData);
  this.setSubscriber('urn:cdif-net:serviceID:Humidity', subscribeHumidityEvent, onHumidityEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Humidity', unsubscribeHumidityEvent);

  this.setAction('urn:cdif-net:serviceID:Magnetometer', 'getMagnetometerData', getMagnetometerData);
  this.setSubscriber('urn:cdif-net:serviceID:Magnetometer', subscribeMagnetometerEvent, onMagnetometerEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Magnetometer', unsubscribeMagnetometerEvent);

  this.setAction('urn:cdif-net:serviceID:Barometer', 'getBarometerData', getBarometerData);
  this.setSubscriber('urn:cdif-net:serviceID:Barometer', subscribeBarometerEvent, onBarometerEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Barometer', unsubscribeBarometerEvent);

  this.setAction('urn:cdif-net:serviceID:Gyroscope', 'getGyroscopeData', getGyroscopeData);
  this.setSubscriber('urn:cdif-net:serviceID:Gyroscope', subscribeGyroscopeEvent, onGyroscopeEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Gyroscope', unsubscribeGyroscopeEvent);
};

util.inherits(SensorTag, CdifDevice);

var onLuxometerEvent = function() {
  var output = {};
  output['illuminance'] = arguments[0].toFixed(2);
  this.sendEvent(output);
};

var onTemperatureEvent = function() {
  var output = {};
  output['temprature'] = arguments[1].toFixed(2);
  this.sendEvent(output);
};

var onAccelerometerEvent = function() {
  var output = {};
  output['x'] = arguments[0].toFixed(2);
  output['y'] = arguments[1].toFixed(2);
  output['z'] = arguments[2].toFixed(2);
  this.sendEvent(output);
};

var onHumidityEvent = function() {
  var output = {};
  output['humidity'] = arguments[1].toFixed(2);
  this.sendEvent(output);
};

var onMagnetometerEvent = function() {
  var output = {};
  output['x'] = arguments[0].toFixed(2);
  output['y'] = arguments[1].toFixed(2);
  output['z'] = arguments[2].toFixed(2);
  this.sendEvent(output);
};

var onBarometerEvent = function() {
  var output = {};
  output['pressure'] = arguments[0].toFixed(2);
  this.sendEvent(output);
};

var onGyroscopeEvent = function() {
  var output = {};
  output['x'] = arguments[0].toFixed(2);
  output['y'] = arguments[1].toFixed(2);
  output['z'] = arguments[2].toFixed(2);
  this.sendEvent(output);
};

SensorTag.is = function(peripheral) {
  return (CC2540SensorTag.is(peripheral) || CC2650SensorTag.is(peripheral));
};

var subscribeLuxometerEvent = function(onChange, onEvent, callback) {
  var _this = this;
  this.sensorTag.on('luxometerChange', onEvent);
  this.sensorTag.enableLuxometer(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyLuxometer(function(error) {
        callback(error);
      });
    }
  });
};

var unsubscribeLuxometerEvent = function(callback) {
  this.sensorTag.unnotifyLuxometer(function(error) {
    callback(error);
  });
};

var subscribeTemperatureEvent = function(onChange, onEvent, callback) {
  var _this = this;
  this.sensorTag.on('irTemperatureChange', onEvent);
  this.sensorTag.enableIrTemperature(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyIrTemperature(function(error) {
        callback(error);
      });
    }
  });
};

var unsubscribeTemperatureEvent = function(callback) {
  this.sensorTag.unnotifyIrTemperature(function(error) {
    callback(error);
  });
};

var subscribeAccelerometerEvent = function(onChange, onEvent, callback) {
  var _this = this;
  this.sensorTag.on('accelerometerChange', onEvent);
  this.sensorTag.enableAccelerometer(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyAccelerometer(function(error) {
        callback(error);
      });
    }
  });
};

var unsubscribeAccelerometerEvent = function(callback) {
  this.sensorTag.unnotifyAccelerometer(function(error) {
    callback(error);
  });
};

var subscribeHumidityEvent = function(onChange, onEvent, callback) {
  var _this = this;
  this.sensorTag.on('humidityChange', onEvent);
  this.sensorTag.enableHumidity(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyHumidity(function(error) {
        callback(error);
      });
    }
  });
};

var unsubscribeHumidityEvent = function(callback) {
  this.sensorTag.unnotifyHumidity(function(error) {
    callback(error);
  });
};

var subscribeMagnetometerEvent = function(onChange, onEvent, callback) {
  var _this = this;
  this.sensorTag.on('magnetometerChange', onEvent);
  this.sensorTag.enableMagnetometer(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyMagnetometer(function(error) {
        callback(error);
      });
    }
  });
};

var unsubscribeMagnetometerEvent = function(callback) {
  this.sensorTag.unnotifyMagnetometer(function(error) {
    callback(error);
  });
};

var subscribeBarometerEvent = function(onChange, onEvent, callback) {
  var _this = this;
  this.sensorTag.on('barometricPressureChange', onEvent);
  this.sensorTag.enableBarometricPressure(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyBarometricPressure(function(error) {
        callback(error);
      });
    }
  });
};

var unsubscribeBarometerEvent = function(callback) {
  this.sensorTag.unnotifyBarometricPressure(function(error) {
    callback(error);
  });
};

var subscribeGyroscopeEvent = function(onChange, onEvent, callback) {
  var _this = this;
  this.sensorTag.on('gyroscopeChange', onEvent);
  this.sensorTag.enableGyroscope(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyGyroscope(function(error) {
        callback(error);
      });
    }
  });
};

var unsubscribeGyroscopeEvent = function(callback) {
  this.sensorTag.unnotifyGyroscope(function(error) {
    callback(error);
  });
};

var getLuxometerData = function(args, callback) {
  var output = {}; var _this = this;

  this.sensorTag.enableLuxometer(function(error) {
    if (error) {
      callback(error, null);
    } else {
      _this.sensorTag.readLuxometer(function(error, lux) {
        if (error) {
          callback(error, null);
        } else {
          output['illuminance'] = lux.toFixed(2);
          callback(null, output);
        }
      });
    }
  });
};

var getTemperatureData = function(args, callback) {
  var output = {}; var _this = this;

  this.sensorTag.enableIrTemperature(function(error) {
    if (error) {
      callback(error, null);
    } else {
      _this.sensorTag.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
        if (error) {
          callback(error, null);
        } else {
          output['temperature'] = ambientTemperature.toFixed(2);
          callback(null, output);
        }
      });
    }
  });
};

var getHumidityData = function(args, callback) {
  var output = {}; var _this = this;

  this.sensorTag.enableHumidity(function(error) {
    if (error) {
      callback(error, null);
    } else {
      _this.sensorTag.readHumidity(function(error, temperature, humidity) {
        if (error) {
          callback(error, null);
        } else {
          output['humidity'] = humidity.toFixed(2);
          callback(null, output);
        }
      });
    }
  });
};

var getAccelerometerData = function(args, callback) {
  var output = {}; var _this = this;

  this.sensorTag.enableAccelerometer(function(error) {
    if (error) {
      callback(error, null);
    } else {
      _this.sensorTag.readAccelerometer(function(error, x, y, z) {
        if (error) {
          callback(error, null);
        } else {
          output['x'] = x.toFixed(2);
          output['y'] = y.toFixed(2);
          output['z'] = z.toFixed(2);
          callback(null, output);
        }
      });
    }
  });
};

var getMagnetometerData = function(args, callback) {
  var output = {}; var _this = this;

  this.sensorTag.enableMagnetometer(function(error) {
    if (error) {
      callback(error, null);
    } else {
      _this.sensorTag.readMagnetometer(function(error, x, y, z) {
        if (error) {
          callback(error, null);
        } else {
          output['x'] = x.toFixed(2);
          output['y'] = y.toFixed(2);
          output['z'] = z.toFixed(2);
          callback(null, output);
        }
      });
    }
  });
};

var getBarometerData = function(args, callback) {
  var output = {}; var _this = this;

  this.sensorTag.enableBarometricPressure(function(error) {
    if (error) {
      callback(error, null);
    } else {
      _this.sensorTag.readBarometricPressure(function(error, pressure) {
        if (error) {
          callback(error, null);
        } else {
          output['pressure'] = pressure.toFixed(2);
          callback(null, output);
        }
      });
    }
  });
};

var getGyroscopeData = function(args, callback) {
  var output = {}; var _this = this;

  this.sensorTag.enableGyroscope(function(error) {
    if (error) {
      callback(error, null);
    } else {
      _this.sensorTag.readGyroscope(function(error, x, y, z) {
        if (error) {
          callback(error, null);
        } else {
          output['x'] = x.toFixed(2);
          output['y'] = y.toFixed(2);
          output['z'] = z.toFixed(2);
          callback(null, output);
        }
      });
    }
  });
};

module.exports = SensorTag;
