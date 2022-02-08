"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.MODEM_PASSWORD = exports.MODEM_USER = exports.MODEM_URL = exports.APP_VERSION = exports.APP_NAME = undefined;

require("dotenv/config");

const ENV = process.env;
const APP_NAME = "Fiber Optic Modem Restarter";
const APP_VERSION = "1.0.0";
const MODEM_URL = ENV['MODEM_URL'] || 'http://192.168.1.1';
const MODEM_USER = ENV['MODEM_USER'] || 'admin';
const MODEM_PASSWORD = ENV['MODEM_PASSWORD'] || 'admin';

exports.APP_NAME = APP_NAME;
exports.APP_VERSION = APP_VERSION;
exports.MODEM_URL = MODEM_URL;
exports.MODEM_USER = MODEM_USER;
exports.MODEM_PASSWORD = MODEM_PASSWORD;
//# sourceMappingURL=config.js.map