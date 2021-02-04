const express = require("express");
const app = express();
const EXport = 3002;
import { iQTT } from "../MQTT/MQHTTP";
import { tasmCo } from "./Tasmota/_tasmotaControler";
const bodyParser  = require("body-parser")

let tas
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/t", (req, res) => {
  iQTT.publishTo("cmnd/json-Bedroom/POWER", "2");

  res.send("Hello World!");
});
app.use(bodyParser.json())
app.post("/tasmota/:device_id/:cmd",(req, res) => {
  
  tasmCo.sendCommand(req.params.device_id,req.params.cmd,req.body.payload.toString())
  res.send(200);
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
