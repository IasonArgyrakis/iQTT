let cookie = require("cookie");
let cookieParser = require("cookie-parser");
let express = require("express");
let app = express();
const https = require("https");
const fs = require("fs");
let EXport = 4300;
var key = fs.readFileSync(__dirname + "/cert/selfsigned.key", "utf8");
var cert = fs.readFileSync(__dirname + "/cert/selfsigned.crt", "utf8");
var options = {
  key: key,
  cert: cert,
};

var SecureServer = https.createServer(options, app);
import { iQTT } from "../MQTT/MQHTTP";
import { tasmCo } from "./Tasmota/_tasmotaControler";
import { telegrmClientAPI as telegrmClient } from "./telegram/telegram";

const bodyParser = require("body-parser");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
app.use(cookieParser("secrter"));
app.get("/login/:username/:password", function (req, res, next) {
  //req.body
  interface creds {
    username: string;
    password: string;
  }
  let creds: creds = {
    username: req.params.username,
    //username: req.body.username,
    password: req.params.password,
  };

  //user autrherication
  if (creds.username == "j" && creds.password == "son") {
    res.cookie("User", "Json", {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      signed: true,
    });
    //telegrmClient.sendMessage(973093704,"json cookie" );

    res.status(200);
    res.send("🍪");
  } else if (creds.username == "d" && creds.password == "ja") {
    res.cookie("User", "DJA", {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      signed: true,
    });
    res.status(200);
    res.send("🍪");
    //telegrmClient.sendMessage(973093704,"dja cookie" );
  } else if (creds.username == "y" && creds.password == "da") {
    res.cookie("User", "Yannis", {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
      signed: true,
    });
    res.status(200);
    res.send("🍪");
    //telegrmClient.sendMessage(973093704,"yda cookie" );
  }
  res.status(400);
  res.send("no cookie");
  //telegrmClient.sendMessage(973093704,"failed cookie" );
});

function authenticateToken(req, res, next) {
  //neeed to hande the reqest and next() or not
  let users = ["Yannis", "DJA", "Json"];
  if (users.includes(req.signedCookies.User)) {
    console.log("Authenticated Cookie");
    telegrmClient.sendMessage(
      973093704,
      "Authenticated Cookie:" + req.signedCookies.User
    );
    next();
  } else {
    console.log("Invalid Token attempt");
    telegrmClient.sendMessage(973093704, "Invalid Token attempt");
    res.redirect("/login");
  }
}

app.get("/auth", [authenticateToken], function (req, res, next) {
  //req.body
  console.log(req.signedCookies.User);
  interface creds {
    username: string;
    password: string;
  }
  let creds: creds = {
    username: req.body.username,
    password: req.body.password,
  };

  res.send({ ok: "ok" });
});

app.get("/t", [authenticateToken], (req, res) => {
  iQTT.publishTo("cmnd/json-Bedroom/POWER", "2", 2);

  res.send("Hello World!");
});
app.get("/arm", (req, res) => {
  iQTT.publishTo("testo", "1", 1);

  res.send("Hello World!");
});
app.get("/armq", (req, res) => {
  iQTT.publishTo("testo", "2", 2);

  res.send("Hello World!");
});
app.get("/garage/:cmd", [authenticateToken], (req, res) => {
  iQTT.publishTo("Garage_Commands", req.params.cmd, 2);
  res.send("Hello World!");
});
app.use(bodyParser.json());
//app.use(cookieParser)
app.post("/tasmota/:device_id/:cmd", (req, res) => {
  tasmCo.sendCommand(
    req.params.device_id,
    req.params.cmd,
    req.body.payload.toString()
  );
  res.sendStatus(200);
});
app.get("/tasmota/all", (req, res) => {
  res.json(tasmCo.getTasmoDevList());
});

let Enpoint = {
  start: SecureServer.listen(EXport, () => {
    console.log(`API listening at http://localhost:${EXport}`);
    iQTT.subscribeTo("#"); //listen to all topics
  }),
};
export { Enpoint as HTTPAPI };
