const redis = require('redis');
const {
    promisify
} = require("util");

function DB() {
    this.client = redis.createClient(6379, '127.0.0.1');
    this.client.on('connect', function () {
        console.log("[+] Redis Connect...")
    })
    this.client.on("error", function (err) {
        console.error("[-]", err.message);
    });
};
DB.prototype.pop = async function () {
    const blpopAsync = promisify(this.client.blpop).bind(this.client);
    return await blpopAsync("urls", 60)
};
DB.prototype.push = async function (target) {
    const lpushAsync = promisify(this.client.lpush).bind(this.client);
    return await lpushAsync("urls", target)
};

module.exports = new DB()