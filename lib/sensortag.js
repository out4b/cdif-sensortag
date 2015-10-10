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
  this.handlers = {};

  if (isCC2650) {
    this.registerServiceHandler('urn:cdif-net:serviceId:Illuminance',
                              'getIlluminanceData',
                              getLuxometerData.bind(this),
                              subscribeLuxometerEvent.bind(this),
                              unsubscribeLuxometerEvent.bind(this),
                              'luxometerChange',
                              onLuxometerEvent.bind(this));
  }
  this.registerServiceHandler('urn:cdif-net:serviceId:Temperature',
                            'getTemperatureData',
                            getTemperatureData.bind(this),
                            subscribeTemperatureEvent.bind(this),
                            unsubscribeTemperatureEvent.bind(this),
                            'irTemperatureChange',
                            onTemperatureEvent.bind(this));
  this.registerServiceHandler('urn:cdif-net:serviceId:Accelerometer',
                            'getAccelerometerData',
                            getAccelerometerData.bind(this),
                            subscribeAccelerometerEvent.bind(this),
                            unsubscribeAccelerometerEvent.bind(this),
                            'accelerometerChange',
                            onAccelerometerEvent.bind(this));
  this.registerServiceHandler('urn:cdif-net:serviceId:Humidity',
                            'getHumidityData',
                            getHumidityData.bind(this),
                            subscribeHumidityEvent.bind(this),
                            unsubscribeHumidityEvent.bind(this),
                            'humidityChange',
                            onHumidityEvent.bind(this));
  this.registerServiceHandler('urn:cdif-net:serviceId:Magnetometer',
                            'getMagnetometerData',
                            getMagnetometerData.bind(this),
                            subscribeMagnetometerEvent.bind(this),
                            unsubscribeMagnetometerEvent.bind(this),
                            'magnetometerChange',
                            onMagnetometerEvent.bind(this));
  this.registerServiceHandler('urn:cdif-net:serviceId:Barometer',
                            'getBarometerData',
                            getBarometerData.bind(this),
                            subscribeBarometerEvent.bind(this),
                            unsubscribeBarometerEvent.bind(this),
                            'barometricPressureChange',
                            onBarometerEvent.bind(this));
  this.registerServiceHandler('urn:cdif-net:serviceId:Gyroscope',
                            'getGyroscopeData',
                            getGyroscopeData.bind(this),
                            subscribeGyroscopeEvent.bind(this),
                            unsubscribeGyroscopeEvent.bind(this),
                            'gyroscopeChange',
                            onGyroscopeEvent.bind(this));
};

util.inherits(SensorTag, CdifDevice);

SensorTag.prototype.registerServiceHandler = function(serviceId, actionName, actionCall, subscriber, unsubscriber, eventName, eventCallback) {
  this.handlers[serviceId] = {
    onEvent: function() {
      eventCallback(serviceId, arguments);
    },
    subscribe: function(callback) {
      subscriber(callback);
    },
    unsubscribe: function(callback) {
      unsubscriber(callback);
    }
  }
  this.sensorTag.on(eventName, this.handlers[serviceId].onEvent);
  this.actions[serviceId][actionName] = actionCall;
}

var onLuxometerEvent = function(serviceId, arguments) {
  var output = {};
  output['illuminance'] = arguments[0];
  this.emit(serviceId, output);
}

var onTemperatureEvent = function(serviceId, arguments) {
  var output = {};
  output['temprature'] = arguments[1];
  this.emit(serviceId, output);
}

var onAccelerometerEvent = function(serviceId, arguments) {
  var output = {};
  output['x'] = arguments[0];
  output['y'] = arguments[1];
  output['z'] = arguments[2];
  this.emit(serviceId, output);
}

var onHumidityEvent = function(serviceId, arguments) {
  var output = {};
  output['humidity'] = arguments[1];
  this.emit(serviceId, output);
}

var onMagnetometerEvent = function(serviceId, arguments) {
  var output = {};
  output['x'] = arguments[0];
  output['y'] = arguments[1];
  output['z'] = arguments[2];
  this.emit(serviceId, output);
}

var onBarometerEvent = function(serviceId, arguments) {
  var output = {};
  output['pressure'] = arguments[0];
  this.emit(serviceId, output);
}

var onGyroscopeEvent = function(serviceId, arguments) {
  var output = {};
  output['x'] = arguments[0];
  output['y'] = arguments[1];
  output['z'] = arguments[2];
  this.emit(serviceId, output);
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
  var _this = this;
  _this.sensorTag.unnotifyLuxometer(function(error) {
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
  var _this = this;
  _this.sensorTag.unnotifyIrTemperature(function(error) {
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
  var _this = this;
  _this.sensorTag.unnotifyAccelerometer(function(error) {
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
  var _this = this;
  _this.sensorTag.unnotifyHumidity(function(error) {
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
  var _this = this;
  _this.sensorTag.unnotifyMagnetometer(function(error) {
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
  var _this = this;
  _this.sensorTag.unnotifyBarometricPressure(function(error) {
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
  var _this = this;
  _this.sensorTag.unnotifyGyroscope(function(error) {
    callback(error);
  });
}

SensorTag.prototype.subscribeEvent = function(serviceId, callback) {
  var _this = this;
  var handler = this.handlers[serviceId];
  handler.subscribe(callback);
}

SensorTag.prototype.unsubscribeEvent = function(serviceId, callback) {
  var _this = this;
  var handler = this.handlers[serviceId];
  handler.unsubscribe(callback);
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
          output['illuminance'] = lux;
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
          output['temprature'] = ambientTemperature;
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
          output['humidity'] = humidity;
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
          output['x'] = x; output['y'] = y; output['z'] = z;
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
          output['x'] = x; output['y'] = y; output['z'] = z;
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
          output['pressure'] = pressure;
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
          output['x'] = x; output['y'] = y; output['z'] = z;
          callback(null, output);
        }
      });
    }
  });
};

module.exports = SensorTag;
