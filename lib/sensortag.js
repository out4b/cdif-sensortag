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
    service = this.services['urn:cdif-net:serviceId:Illuminance'];
    service.addAction('getIlluminanceData', getLuxometerData.bind(this));
    service.subscribe = subscribeLuxometerEvent.bind(this);
    service.unsubscribe = unsubscribeLuxometerEvent.bind(this);
    service.setEventListener(this.sensorTag, 'luxometerChange', onLuxometerEvent);
  }
  service = this.services['urn:cdif-net:serviceId:Temperature'];
  service.addAction('getTemperatureData', getTemperatureData.bind(this));
  service.subscribe = subscribeTemperatureEvent.bind(this);
  service.unsubscribe = unsubscribeTemperatureEvent.bind(this);
  service.setEventListener(this.sensorTag, 'irTemperatureChange', onTemperatureEvent);

  service = this.services['urn:cdif-net:serviceId:Accelerometer'];
  service.addAction('getAccelerometerData', getAccelerometerData.bind(this));
  service.subscribe = subscribeAccelerometerEvent.bind(this);
  service.unsubscribe = unsubscribeAccelerometerEvent.bind(this);
  service.setEventListener(this.sensorTag, 'accelerometerChange', onAccelerometerEvent);

  service = this.services['urn:cdif-net:serviceId:Humidity'];
  service.addAction('getHumidityData', getHumidityData.bind(this));
  service.subscribe = subscribeHumidityEvent.bind(this);
  service.unsubscribe = unsubscribeHumidityEvent.bind(this);
  service.setEventListener(this.sensorTag, 'humidityChange', onHumidityEvent);

  service = this.services['urn:cdif-net:serviceId:Magnetometer'];
  service.addAction('getMagnetometerData', getMagnetometerData.bind(this));
  service.subscribe = subscribeMagnetometerEvent.bind(this);
  service.unsubscribe = unsubscribeMagnetometerEvent.bind(this);
  service.setEventListener(this.sensorTag, 'magnetometerChange', onMagnetometerEvent);

  service = this.services['urn:cdif-net:serviceId:Barometer'];
  service.addAction('getBarometerData', getBarometerData.bind(this));
  service.subscribe = subscribeBarometerEvent.bind(this);
  service.unsubscribe = unsubscribeBarometerEvent.bind(this);
  service.setEventListener(this.sensorTag, 'barometricPressureChange', onBarometerEvent);

  service = this.services['urn:cdif-net:serviceId:Gyroscope'];
  service.addAction('getGyroscopeData', getGyroscopeData.bind(this));
  service.subscribe = subscribeGyroscopeEvent.bind(this);
  service.unsubscribe = unsubscribeGyroscopeEvent.bind(this);
  service.setEventListener(this.sensorTag, 'gyroscopeChange', onGyroscopeEvent);
};

util.inherits(SensorTag, CdifDevice);

var onLuxometerEvent = function() {
  var output = {};
  output['illuminance'] = arguments[0].toFixed(2);
  this.sendEvent(output);
}

var onTemperatureEvent = function() {
  var output = {};
  output['temprature'] = arguments[1].toFixed(2);
  this.sendEvent(output);
}

var onAccelerometerEvent = function() {
  var output = {};
  output['x'] = arguments[0].toFixed(2);
  output['y'] = arguments[1].toFixed(2);
  output['z'] = arguments[2].toFixed(2);
  this.sendEvent(output);
}

var onHumidityEvent = function() {
  var output = {};
  output['humidity'] = arguments[1].toFixed(2);
  this.sendEvent(output);
}

var onMagnetometerEvent = function() {
  var output = {};
  output['x'] = arguments[0].toFixed(2);
  output['y'] = arguments[1].toFixed(2);
  output['z'] = arguments[2].toFixed(2);
  this.sendEvent(output);
}

var onBarometerEvent = function() {
  var output = {};
  console.log(arguments);
  output['pressure'] = arguments[0].toFixed(2);
  this.sendEvent(output);
}

var onGyroscopeEvent = function() {
  var output = {};
  console.log(arguments);
  output['x'] = arguments[0].toFixed(2);
  output['y'] = arguments[1].toFixed(2);
  output['z'] = arguments[2].toFixed(2);
  this.sendEvent(output);
}

SensorTag.is = function(peripheral) {
  return (CC2540SensorTag.is(peripheral) || CC2650SensorTag.is(peripheral));
};

var subscribeLuxometerEvent = function(callback) {
  var _this = this;
  this.sensorTag.enableLuxometer(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyLuxometer(function(error) {
        callback(error);
      });
    }
  });
}

var unsubscribeLuxometerEvent = function(callback) {
  this.sensorTag.unnotifyLuxometer(function(error) {
    callback(error);
  });
}

var subscribeTemperatureEvent = function(callback) {
  var _this = this;
  this.sensorTag.enableIrTemperature(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyIrTemperature(function(error) {
        callback(error);
      });
    }
  });
}

var unsubscribeTemperatureEvent = function(callback) {
  this.sensorTag.unnotifyIrTemperature(function(error) {
    callback(error);
  });
}

var subscribeAccelerometerEvent = function(callback) {
  var _this = this;
  this.sensorTag.enableAccelerometer(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyAccelerometer(function(error) {
        callback(error);
      });
    }
  });
}

var unsubscribeAccelerometerEvent = function(callback) {
  this.sensorTag.unnotifyAccelerometer(function(error) {
    callback(error);
  });
}

var subscribeHumidityEvent = function(callback) {
  var _this = this;
  this.sensorTag.enableHumidity(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyHumidity(function(error) {
        callback(error);
      });
    }
  });
}

var unsubscribeHumidityEvent = function(callback) {
  this.sensorTag.unnotifyHumidity(function(error) {
    callback(error);
  });
}

var subscribeMagnetometerEvent = function(callback) {
  var _this = this;
  this.sensorTag.enableMagnetometer(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyMagnetometer(function(error) {
        callback(error);
      });
    }
  });
}

var unsubscribeMagnetometerEvent = function(callback) {
  this.sensorTag.unnotifyMagnetometer(function(error) {
    callback(error);
  });
}

var subscribeBarometerEvent = function(callback) {
  var _this = this;
  this.sensorTag.enableBarometricPressure(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyBarometricPressure(function(error) {
        callback(error);
      });
    }
  });
}

var unsubscribeBarometerEvent = function(callback) {
  this.sensorTag.unnotifyBarometricPressure(function(error) {
    callback(error);
  });
}

var subscribeGyroscopeEvent = function(callback) {
  var _this = this;
  this.sensorTag.enableGyroscope(function(error) {
    if (error) {
      callback(error);
    } else {
      _this.sensorTag.notifyGyroscope(function(error) {
        callback(error);
      });
    }
  });
}

var unsubscribeGyroscopeEvent = function(callback) {
  this.sensorTag.unnotifyGyroscope(function(error) {
    callback(error);
  });
}

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
          output['temprature'] = ambientTemperature.toFixed(2);
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
