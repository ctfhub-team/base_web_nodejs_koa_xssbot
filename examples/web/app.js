const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session');

const db = require('../utils');
const config = require('../config');

const port = parseInt(config.PORT);

const app = new Koa()
const router = new Router();

app.keys = ['www.ctfhub.com'];
app.use(session({
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
}, app));

app.use(async (ctx, next) => {
    console.log(new Date(), ctx.method, ctx.url);
    await next()
})

router.get('/', async (ctx, next) => {
    ctx.redirect('/hello?name=ctfhub')
});

router.get('/hello', async (ctx, next) => {
    ctx.response.body = `<h5>Hello, ${ctx.query.name}!</h5>
    <a href="/submit">Submit to Admin</a>`;
});


// 表单
router.get('/submit', async (ctx, next) => {
    ctx.response.body = `
    <h1>Submit URL</h1>
    <form action="/submit" method="post">
    <p>Name: <input name="url" value=""></p>
    <p><input type="submit" value="Submit"></p>
    </form>`;
});

function escapeHTML(v) {
    return v.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
router.post('/submit', async (ctx, next) => {
    if (ctx.session.t > Date.now() / 1000) {
        ctx.response.body = `Wait a while (5s)`;
        return
    }
    ctx.session.t = Date.now() / 1000 + 5
    let target = `${ctx.request.body.url}`.toString().trim();
    console.log(`[=] Submit [${target}]`)
    if (!/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(target)) {
        ctx.response.body = `<h4>URL Error</h4>`;
        return
    }
    let res = await db.push(target)
    if (res)
        ctx.response.body = `<h4>Submitted [${escapeHTML(target)}] successfully!</h4>`;
    else
        ctx.response.body = `<h4>Submission Failed!</h4>`;
});

app.use(bodyParser())
app.use(router.routes());

app.listen(port, () => {
    console.log(`[+] This server is running at
        http://localhost:${port}
        http://${config.DOMAIN}:${port}`)
})