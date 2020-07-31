#!/bin/bash
git pull
cd /opt/dynDNS
npm install
rm nohup.out -f
nohup node index.js&
