const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router();
const config = require('../config');
const port = parseInt(config.PORT);

router.get('/', async (ctx, next) => {
    ctx.response.body = `This is default page, you should put yours`;
});

app.use(router.routes());

app.listen(port, () => {
    console.log(`[+] This server is running at
        http://localhost:${port}
        http://${config.DOMAIN}:${port}`)
})