let cookie = require('cookie');
let cookieParser = require("cookie-parser");
let express = require("express");
let app = express();
const https = require('https');
const fs = require('fs');
let EXport = 4300;
var key = fs.readFileSync(__dirname +"/cert/selfsigned.key", 'utf8');
var cert = fs.readFileSync(__dirname +"/cert/selfsigned.crt", 'utf8');
var options = {
  key: key,
  cert: cert
};

var SecureServer = https.createServer(options, app);
import { iQTT } from "../MQTT/MQHTTP";
import { tasmCo } from "./Tasmota/_tasmotaControler";

const bodyParser  = require("body-parser")


app.get("/", (req, res) => {
  res.send("Hello World!"); 
});
app.use(express.json())
app.use(cookieParser("secrter"));
app.post("/login", function (req, res){
   //req.body
   interface creds{username:string,password:string}
   let creds:creds ={username:req.body.username,password:req.body.password}
   //user autrherication
   if(creds.username=="j"&&creds.password=="son")
   {
    res.cookie('Jas', '1', { expires: new Date(Date.now() + 90000), httpOnly: true,signed:true });
   
   }
   else { res.send(400,"no")}
   res.redirect('/auth')
   
   
});

function  authenticateToken(req, res, next) {
  //neeed to hande the reqest and next() or not 
  
  if(req.signedCookies.Jas==1)
  {
    console.log("Authenticated Cookie")
    next()
  }else {console.log("Invalid Token attempt");res.redirect(500,"/login")}

};


app.get("/auth", [authenticateToken],function (req, res,next){
  //req.body
  console.log(req.signedCookies.Jas);
  interface creds{username:string,password:string}
  let creds:creds ={username:req.body.username,password:req.body.password}
  
  res.send({"ok":"ok"})
  
});

app.get("/t",[authenticateToken], (req, res) => {
  iQTT.publishTo("cmnd/json-Bedroom/POWER", "2",2);

  res.send("Hello World!");
});
app.get("/arm", (req, res) => {
  iQTT.publishTo("testo", "1",1);

  res.send("Hello World!");
});
app.get("/armq", (req, res) => {
  iQTT.publishTo("testo", "2",2);

  res.send("Hello World!");
});
app.get("/garage/:cmd",[authenticateToken], (req, res) => {
  iQTT.publishTo("Garage_Commands",req.params.cmd,2);

  res.send("Hello World!");
});
app.use(bodyParser.json())
//app.use(cookieParser)
app.post("/tasmota/:device_id/:cmd",(req, res) => {
  
  tasmCo.sendCommand(req.params.device_id,req.params.cmd,req.body.payload.toString())
  res.sendStatus(200);

});
app.get("/tasmota/all",(req, res) => {
  
 res.json(tasmCo.getTasmoDevList());
});

let Enpoint = {
  start: SecureServer.listen(EXport, () => {
    console.log(`API listening at http://localhost:${EXport}`);
    iQTT.subscribeTo("#"); //listen to all topics
  }),
};
export { Enpoint as HTTPAPI };
