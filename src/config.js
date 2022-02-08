import 'dotenv/config';

const ENV = process.env;
const APP_NAME = "Fiber Optic Modem Restarter";
const APP_VERSION = "1.0.0";
const MODEM_URL = ENV['MODEM_URL'] || 'http://192.168.1.1';
const MODEM_USER = ENV['MODEM_USER'] || 'admin';
const MODEM_PASSWORD = ENV['MODEM_PASSWORD'] || 'admin';

export {
	APP_NAME,
	APP_VERSION,
	MODEM_URL,
	MODEM_USER,
	MODEM_PASSWORD,
};
