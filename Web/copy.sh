#!/bin/bash

cd /home/ven/Projekte/Whis/Tamagochi/Web

rsync -ar --exclude=*.ts src/* bin/
# mv out/server/* server/
# rmdir out/server

# cp -r out/src/* bin/
# rm -rf out/src