FROM node:12-stretch-slim

LABEL Organization="CTFHUB" Author="Virink <virink@outlook.com>"

ENV LANG="C.UTF-8" PUPPETEER_SKIP_CHROMIUM_DOWNLOA=true

COPY _files/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY src /home/bot

RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list && \
    sed -i 's/# deb-src/deb-src/' /etc/apt/sources.list && \
    sed -i '/security/d' /etc/apt/sources.list && \
    apt-get update -y && \
    apt-get upgrade -y; \
    # Install
    apt install -y ca-certificates chromium redis-server udev; \
    # useradd -d /home/bot -u 10086 bot; \
    mkdir -p /home/bot; \
    # yarn config
    yarn config set registry https://registry.npm.taobao.org -g; \
    yarn global add pm2; \
    cd /home; \
    # bot and koa
    yarn add puppeteer-core redis koa koa-router koa-bodyparser koa-session; \
    # 
    chmod +x /usr/local/bin/docker-entrypoint.sh; \
    # Clear
    yarn cache clean; \
    apt-get purge -y --auto-remove; \
    rm -rf /tmp/*;

WORKDIR /home/bot

EXPOSE 80
