const config = require('../config');

const custom = async function (page) {
    await page.setCookie({
        name: config.FLAG_KEY,
        value: config.FLAG,
        domain: config.DOMAIN,
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax"
    });
}

module.exports = custom