
GLOBAL._ = require('underscore');
GLOBAL.Q = require('q');

var inj = require('./injector');
GLOBAL.injector = new inj.Injector();

var API = require('./api').PinitAPI;

var api = new API();
