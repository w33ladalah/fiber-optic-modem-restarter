import { Logger } from './lib/logger';
import { FilePaths } from './lib/file-paths.js';
import { PuppeteerWrapper } from './lib/puppeteer-wrapper';
import { MODEM_URL, MODEM_USER, MODEM_PASSWORD } from './config';
//#endregion

//#region Setup - Dependency Injection-----------------------------------------------
const _logger = new Logger();
const _filePaths = new FilePaths(_logger, "modem-restarter");
const _puppeteerConfig = { headless: false, args: ['--disable-features=site-per-process'] };
const _puppeteerWrapper = new PuppeteerWrapper(_logger, _filePaths, _puppeteerConfig);
//#endregion

const main = async () => {
	const page = await _puppeteerWrapper.newPage();
	const loginUrl = MODEM_URL;

	await page.goto(loginUrl);
	await page.type('input#Frm_Username', MODEM_USER, { delay: 10 });
	await page.type('input#Frm_Password', MODEM_PASSWORD, { delay: 10 });
	await page.click('input#LoginId');

	await page.waitForTimeout(1000);
	await page.waitForSelector('iframe[src*="template.gch"]', { timeout: 3000 });

	const frameHandle = await page.$('iframe[src="template.gch"]');
	const frame = await frameHandle.contentFrame();

	await frame.click('tr[onclick="javascript:openLink(\'getpage.gch?pid=1002&nextpage=net_tr069_basic_t.gch\')"]');
	await frame.waitForTimeout(500);
	await frame.click('tr[onclick=\'javascript:OnMenuItemClick("mmManager","smSysMgr"); openLink("getpage.gch?pid=1002&nextpage=manager_dev_conf_t.gch")\']');
	await frame.waitForTimeout(500);
	await frame.click('input[value="Reboot"]');
	await frame.waitForTimeout(500);
	await frame.click('input[value="Confirm"]');

	await page.waitForTimeout(2000);
}

(async () => {
	try {
		const chromeSet = await _puppeteerWrapper.setup();
		if (!chromeSet) {
			console.error("Chrome not found!");
		} else {
			console.log(_puppeteerWrapper._getSavedPath());
		}

		await main();
	} catch (e) {
		_logger.logError('Thrown error:');
		_logger.logError(e);

		process.exit(1);
	} finally {
		await _puppeteerWrapper.cleanup();
	}

	console.log('Done. Close application process.');
})();
