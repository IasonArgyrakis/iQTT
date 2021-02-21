import * as  cookieParser from 'cookie-parser';
const express = require("express");
const app = express();
const EXport = 4300;
import { iQTT } from "../MQTT/MQHTTP";
import { tasmCo } from "./Tasmota/_tasmotaControler";
const bodyParser  = require("body-parser")

let tas
app.get("/", (req, res) => {
  res.send("Hello World!"); 
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
