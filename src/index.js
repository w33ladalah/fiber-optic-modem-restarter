import { Logger } from './lib/logger';
import { FilePaths } from './lib/file-paths.js';
import { PuppeteerWrapper } from './lib/puppeteer-wrapper';
import { MODEM_URL, MODEM_USER, MODEM_PASSWORD } from './config';
//#endregion

//#region Setup - Dependency Injection-----------------------------------------------
const _logger = new Logger();
const _filePaths = new FilePaths(_logger, "modem-restarter");
const _puppeteerConfig = { headless: true, args: ['--lang=en-EN,en'] };
const _puppeteerWrapper = new PuppeteerWrapper(_logger, _filePaths, _puppeteerConfig);
//#endregion

console.log([MODEM_URL, MODEM_USER, MODEM_PASSWORD]);
