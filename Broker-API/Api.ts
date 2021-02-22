let cookie = require('cookie');
let cookieParser = require("cookie-parser");
let express = require("express");
let app = express();
let EXport = 4300;
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
    res.redirect('/auth')
   }
   
   
});

app.use(function authenticateToken(req, res, next) {
  //neeed to hande the reqest and next() or not 
  if(req.signedCookies.Jas)
  {
    console.log("if")
    next()
  }else {console.log("if2");res.redirect("/login")}

});


app.get("/auth", function (req, res){
  //req.body
  console.log(req.signedCookies);
  interface creds{username:string,password:string}
  let creds:creds ={username:req.body.username,password:req.body.password}
  
  res.send({"ok":"ok"})
  
});

app.get("/t", (req, res) => {
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
app.get("/garage/:cmd", (req, res) => {
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
  start: app.listen(EXport, () => {
    console.log(`API listening at http://localhost:${EXport}`);
    iQTT.subscribeTo("#"); //listen to all topics
  }),
};
export { Enpoint as HTTPAPI };
