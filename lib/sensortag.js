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
    this.setSubscriber('urn:cdif-net:serviceID:Illuminance', subscribeLuxometerEvent);
    this.setUnsubscriber('urn:cdif-net:serviceID:Illuminance', unsubscribeLuxometerEvent);
  }
  this.setAction('urn:cdif-net:serviceID:Temperature', 'getTemperatureData', getTemperatureData);
  this.setSubscriber('urn:cdif-net:serviceID:Temperature', subscribeTemperatureEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Temperature', unsubscribeTemperatureEvent);

  this.setAction('urn:cdif-net:serviceID:Accelerometer', 'getAccelerometerData', getAccelerometerData);
  this.setSubscriber('urn:cdif-net:serviceID:Accelerometer', subscribeAccelerometerEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Accelerometer', unsubscribeAccelerometerEvent);

  this.setAction('urn:cdif-net:serviceID:Humidity', 'getHumidityData', getHumidityData);
  this.setSubscriber('urn:cdif-net:serviceID:Humidity', subscribeHumidityEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Humidity', unsubscribeHumidityEvent);

  this.setAction('urn:cdif-net:serviceID:Magnetometer', 'getMagnetometerData', getMagnetometerData);
  this.setSubscriber('urn:cdif-net:serviceID:Magnetometer', subscribeMagnetometerEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Magnetometer', unsubscribeMagnetometerEvent);

  this.setAction('urn:cdif-net:serviceID:Barometer', 'getBarometerData', getBarometerData);
  this.setSubscriber('urn:cdif-net:serviceID:Barometer', subscribeBarometerEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Barometer', unsubscribeBarometerEvent);

  this.setAction('urn:cdif-net:serviceID:Gyroscope', 'getGyroscopeData', getGyroscopeData);
  this.setSubscriber('urn:cdif-net:serviceID:Gyroscope', subscribeGyroscopeEvent);
  this.setUnsubscriber('urn:cdif-net:serviceID:Gyroscope', unsubscribeGyroscopeEvent);
};

util.inherits(SensorTag, CdifDevice);

SensorTag.is = function(peripheral) {
  return (CC2540SensorTag.is(peripheral) || CC2650SensorTag.is(peripheral));
};

var subscribeLuxometerEvent = function(onChange, callback) {
  var _this = this;
  this.sensorTag.on('luxometerChange', function() {
    var output = {};
    output['illuminance'] = arguments[0].toFixed(2);
    _this.setServiceStates('urn:cdif-net:serviceID:Illuminance', output);
  });
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

var subscribeTemperatureEvent = function(onChange, callback) {
  var _this = this;
  this.sensorTag.on('irTemperatureChange', function() {
    var output = {};
    output['temprature'] = arguments[1].toFixed(2);
    _this.setServiceStates('urn:cdif-net:serviceID:Temperature', output);
  });
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

var subscribeAccelerometerEvent = function(onChange, callback) {
  var _this = this;
  this.sensorTag.on('accelerometerChange', function() {
    var output = {};
    output['x'] = arguments[0].toFixed(2);
    output['y'] = arguments[1].toFixed(2);
    output['z'] = arguments[2].toFixed(2);
    _this.setServiceStates('urn:cdif-net:serviceID:Accelerometer', output);
  });
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

var subscribeHumidityEvent = function(onChange, callback) {
  var _this = this;
  this.sensorTag.on('humidityChange', function() {
    var output = {};
    output['humidity'] = arguments[1].toFixed(2);
    _this.setServiceStates('urn:cdif-net:serviceID:Humidity', output);
  });
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

var subscribeMagnetometerEvent = function(onChange, callback) {
  var _this = this;
  this.sensorTag.on('magnetometerChange', function() {
    var output = {};
    output['x'] = arguments[0].toFixed(2);
    output['y'] = arguments[1].toFixed(2);
    output['z'] = arguments[2].toFixed(2);
    _this.setServiceStates('urn:cdif-net:serviceID:Magnetometer', output);
  });
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

var subscribeBarometerEvent = function(onChange, callback) {
  var _this = this;
  this.sensorTag.on('barometricPressureChange', function() {
    var output = {};
    output['pressure'] = arguments[0].toFixed(2);
    _this.setServiceStates('urn:cdif-net:serviceID:Barometer', output);
  });
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

var subscribeGyroscopeEvent = function(onChange, callback) {
  var _this = this;
  this.sensorTag.on('gyroscopeChange', function() {
    var output = {};
    output['x'] = arguments[0].toFixed(2);
    output['y'] = arguments[1].toFixed(2);
    output['z'] = arguments[2].toFixed(2);
    _this.setServiceStates('urn:cdif-net:serviceID:Gyroscope', output);
  });
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
