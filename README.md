# 基础镜像 WEB NodeJs Koa XSSBot

- L: Linux Alpine
- N: NodeJs
- K: Koa
- P: PM2
- R: Redis

## Example

TODO:

## Usage

### Conf

### ENV

- **DOMAIN_NAME**=xxxx.sandbox.ctfhub.com **Auto Set**
- FLAG=ctfhub{base_web_nodejs_koa_xssbot}

You should rewrite flag.sh when you use this image.
The `$FLAG` is not mandatory, but i hope you use it!

### Files

- src 项目源码
  - bot - Bot XSSBot源码
    + *main.js* - Bot 入口 : 一般无需改动
    + bot.js - Bot 自定义行为
  - web - Web 网站源码
    + app.js - Web 入口
    + ...etc
- Dockerfile
- docker-compose.yml
- meta.yml

### Dockerfile

```Dockerfile
FROM ctfhub/base_web_nodejs_koa_xssbot

COPY src /home/bot/web

RUN cd /home && yarn add xxx; yarn cache clean;
```

### bot/bot.js

> - (English API)(https://pptr.dev/)
> - (中文|Chinese API)(https://zhaoqize.github.io/puppeteer-api-zh_CN/#/)

If you want to do more, plz overwrite `bot/main.js`

```javascript
// Use basic variables in config, it read from process.env
const config = require('../config');

const custom = async function (page) {

    // Example
    // Set Custom Cookie as Flag
    await page.setCookie({
        name: config.FLAG_KEY,
        value: config.FLAG,
        domain: config.DOMAIN,
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "Lax"
    });

    // Add your custom page actions
}

module.exports = custom
```

### web/app.js

[examples/app.js](examples/app.js)