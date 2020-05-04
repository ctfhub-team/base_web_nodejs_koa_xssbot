const puppeteer = require('puppeteer-core');
const config = require('../config');
const db = require('../utils');
const custom = require('./bot');

const visit_url = async (target) => {
    console.log(`[+] Visit Page: ${target}`);
    let page;
    try {
        page = await browser.newPage();

        await page.on('error', err => {
            console.error(`[#] Error!`, err);
        });

        await page.on('pageerror', msg => {
            console.error(`[-] Page error : `, msg);
        })

        await page.on('dialog', async dialog => {
            console.debug(`[#] Dialog : [${dialog.type()}] "${dialog.message()}" ${dialog.defaultValue() || ""}`);
            await dialog.dismiss();
        });

        await page.on('console', async msg => {
            msg.args().forEach(arg => {
                arg.jsonValue().then(_arg => {
                    console.log(`[$] Console : `, _arg)
                });
            });
        });

        await page.on('requestfailed', req => {
            console.error(`[-] Request failed : ${req.url()} ${req.failure().errorText}`);
        })

        // ===== Custom Action =====
        // 自定义页面操作

        await custom(page)

        // await page.setCookie({
        //     name: "bot",
        //     value: "ctfhub",
        //     domain: config.DOMAIN,
        //     path: "/",
        //     httpOnly: false,
        //     secure: false,
        //     sameSite: "Lax"
        // });

        // =========================

        await page.goto(target, {
            waitUntil: 'networkidle2',
        });

        await page.waitFor(5 * 1000);

    } catch (e) {
        console.error("[-] Visit URL:", e.message)
    }

    page.close();
    console.log(`[+] Close...`)
}

var browser;

(async () => {

    // 启动 Chrome
    browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        args: [
            '--headless',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--no-gpu',
            '--disable-default-apps',
            '--disable-translate',
            '--disable-device-discovery-notifications',
            '--disable-software-rasterizer',
            '--disable-xss-auditor'
        ],
        userDataDir: '/home/bot/data/',
        ignoreHTTPSErrors: true
    });

    console.log("[+] Browser", "Launch success!");

    while (true) {
        console.log('[+]', new Date(), `Get URL...`)
        let target = await db.pop()
        // && !/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(target[1])
        if (target && target.length > 1) {
            await visit_url(target[1])
        }
    }

    // console.log("[+] Browser", "Close success!");
    // await browser.close();
})();