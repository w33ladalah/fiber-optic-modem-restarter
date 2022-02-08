'use strict';

var _logger2 = require('./lib/logger');

var _filePaths2 = require('./lib/file-paths.js');

var _puppeteerWrapper2 = require('./lib/puppeteer-wrapper');

var _config = require('./config');

//#endregion

//#region Setup - Dependency Injection-----------------------------------------------
const _logger = new _logger2.Logger();
const _filePaths = new _filePaths2.FilePaths(_logger, "modem-restarter");
const _puppeteerConfig = { headless: true, args: ['--lang=en-EN,en'] };
const _puppeteerWrapper = new _puppeteerWrapper2.PuppeteerWrapper(_logger, _filePaths, _puppeteerConfig);
//#endregion

console.log([_config.MODEM_URL, _config.MODEM_USER, _config.MODEM_PASSWORD]);
//# sourceMappingURL=index.js.map