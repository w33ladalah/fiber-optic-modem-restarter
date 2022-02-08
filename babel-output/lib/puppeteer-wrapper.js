'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PuppeteerWrapper = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _simpleJsonDb = require('simple-json-db');

var _simpleJsonDb2 = _interopRequireDefault(_simpleJsonDb);

var _puppeteerCore = require('puppeteer-core');

var _puppeteerCore2 = _interopRequireDefault(_puppeteerCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * chromePath:  the path of the chrome executable in our pc
 * setup() :    initialize Puppeteer
 * cleanup():   clearnup Puppeteer
 * browser:     global Puppeteer browser instance
 * newPage():   get new page with default user agent and dimensions
 */

/**
 * options: {headless, width, height}
 */
class PuppeteerWrapper {
    constructor(logger, filePaths, options) {
        this._logger = logger;
        this._filePaths = filePaths;
        this._options = options || { headless: true };

        // Public
        this.chromePath = undefined;
        this.browser = undefined;

        this.db = new _simpleJsonDb2.default('./settings.json');
    }

    //#region Public API setup - cleanup

    async setup() {
        const isChromePathSet = await this._setChromePath();
        if (!isChromePathSet) {
            return false;
        }

        const args = [];
        const width = Math.ceil(Math.random() * (1366 - 500) + 500);
        const height = Math.ceil(Math.random() * (768 - 300) + 300);

        args.push(`--window-size=${width},${height}`);
        args.push('--no-sandbox');

        _puppeteerCore2.default.use(StealthPlugin());

        this._logger.logInfo("Setting up puppeteer...");
        this.browser = await _puppeteerCore2.default.launch({
            headless: this._options.headless,
            executablePath: this.chromePath,
            args
        });
        // console.log(await this.browser.userAgent());
        this._logger.logInfo("Puppeteer initialized");
        return true;
    }

    async cleanup() {
        if (this.browser) await this.browser.close();
    }

    async newPage() {
        await this.cleanup();
        await this.setup();

        const page = await this.browser.newPage();

        // page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');

        await this._initCDPSession(page);

        if (this._options.width) {
            await page._client.send('Emulation.clearDeviceMetricsOverride');
        }

        this.browser.on('targetcreated', async target => {
            const page = await target.page();
            this._initCDPSession(page);
        });

        return page;
    }

    //#endregion

    //#region Helpers
    async _initCDPSession(page) {
        try {
            const client = await page.target().createCDPSession();

            await client.send('Network.enable');

            // added configuration
            await client.send('Network.setRequestInterception', {
                patterns: [{ urlPattern: '*' }]
            });

            await client.on('Network.requestIntercepted', async e => {
                // console.log('EVENT INFO: ');
                // console.log(e.interceptionId);
                // console.log(e.resourceType);
                // console.log(e.isNavigationRequest);

                await client.send('Network.continueInterceptedRequest', {
                    interceptionId: e.interceptionId
                });
            });
        } catch (exception) {}
    }

    async _setChromePath() {
        this.chromePath = await this._getSavedPath();

        if (this.chromePath) {
            if (_fs2.default.existsSync(this.chromePath)) return true;

            // The saved path does not exists
            this._logger.logError(`Saved Chrome path does not exists: ${this.chromePath}`);
        }

        // Try the default path
        const defaultPath = this._getDefaultOsPath();

        if (Array.isArray(defaultPath)) {
            for (let i = 0; i < defaultPath.length; i++) {
                this.chromePath = defaultPath[i];
                if (_fs2.default.existsSync(this.chromePath)) {
                    console.log(this.chromePath);
                    this.db.set('chrome_path', this.chromePath);
                    break;
                }
            }

            return true;
        } else {
            this.chromePath = defaultPath;

            if (_fs2.default.existsSync(this.chromePath)) {
                this.db.set('chrome_path', this.chromePath);
                return true;
            }
        }

        return false;
    }

    _getSavedPath() {
        return this.db.get('chrome_path');
    }

    _getDefaultOsPath() {
        if (process.platform === "win32") {
            return ['C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Users\\Hendro\\AppData\\Google\\Chrome\\Application\\chrome.exe'];
        } else {
            return '/usr/bin/google-chrome';
        }
    }

    //#endregion
}
exports.PuppeteerWrapper = PuppeteerWrapper;
//# sourceMappingURL=puppeteer-wrapper.js.map