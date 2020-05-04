#!/bin/sh
# Author : Virink <virink@outlook.com>
# Date   : 2019/12/16, 17:12

redis_status(){
    redis-cli ping > /dev/null 2>&1
}

keep_alive(){
    while true
    do
        redis_status
        if [ $? -ne 0 ]; then
            /usr/bin/redis-server &
        fi
        sleep 5s
    done
}

keep_alive &


echo "Running..."
pm2 start /home/bot/processes.json

tail -f /var/log/bot_*.log