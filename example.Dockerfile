FROM ctfhub/base_web_nodejs_koa_xssbot

# Directory Structure: like this
# COPY src/web /home/bot/web

# Directory Structure: just web src
# COPY src /home/bot/web

# Directory Structure: just for examples
COPY examples/web/app.js /home/bot/web/app.js

# You can install node_modules in /home what your web need
# Some modules have been installed:
#   Bot:
#       puppeteer-core redis
#   Web:
#       koa koa-router koa-bodyparser koa-session
# eg:
#   RUN cd /home && yarn add express
