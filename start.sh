#!/bin/bash
git pull
cd /opt/NodeJS-Cloudflare-Dynamic-DNS
npm install
rm nohup.out -f
nohup node index.js&
