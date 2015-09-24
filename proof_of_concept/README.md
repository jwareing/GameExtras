# chat-example + dot-moving proof of concept
Proof of concept game.

Used these two resources as initial scaffolding inspiration: 

1) http://socket.io/get-started/chat/

2) http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html

This is a modified version that deploys to AWS with the following modifications:
1) Package.json has a "start" script

2) app.js runs process.env.PORT or fallsback to 3000

3) Add 01_files.config to .ebextensions as per (http://dustinbolton.com/websockets-not-working-on-elastic-beanstalk-with-nodejs-when-using-nginx-as-a-proxy/)[http://dustinbolton.com/websockets-not-working-on-elastic-beanstalk-with-nodejs-when-using-nginx-as-a-proxy/]


# TO Run:

1) $ npm install

2) $ node app.js

3) Turn to localhost:3000
