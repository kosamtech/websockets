// use Node's HTTP module to set up a http server
const http = require("http");

const WebSocketServer = require("websocket").server;


const httpServer = http.createServer((req, res) => {
  res.writeHead(200, {
    "access-control-allow-origin": "*"
  })

  res.end(`I don't want your http rubbish `);
});

httpServer.listen(8080, () => {
  console.log("The http server is listening on port 8080")
});

const ws = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false
});

function isOriginAllowed(origin) {
  return true;
}

ws.on("request", (req) => {
  if (!isOriginAllowed(req.origin)) {
    req.reject(403, "Sorry you are not allowed here");
    console.log("Client's request rejected from origin: "+req.origin);
  }

  // establish our websocket connection
  // insert this connection into an object
  let connection = req.accept();
  connection.send(`Connection established!`);
  console.log("Connection established and accepted");

  connection.on("message", (message) => {
    setTimeout(() => {
      connection.send(`Thanks for your message saying: ${message.utf8Data}, but I don't want to talk ti you .. bye bye`);
    },1000);
    setTimeout(() => {
      connection.close(1001, "server shut you down")
    }, 5000)
    // connection.send(`Ping. Message received from client: ${message.utf8Data}`)
  });

  connection.on("close", (code, desc) => {
    console.log(`Peer connection ${connection.remoteAddress} disconnected. The reason is ${desc} and the closure code is ${code}`);
  })
})