
import{MqttErrorObj,MqttClient,MqttDeviceList} from "./MQTT/MqttObj";
import * as fs from "fs";

const aedes = require("aedes")();
//const server = require("net").createServer(aedes.handle);
const port = 8883;



const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
}

const server = require('tls').createServer(
    options,
     aedes.handle)

server.listen(port, function () {
  console.log("server started and listening on port ", port);
});

const DeviceList =new MqttDeviceList()
aedes.authenticate = async function (client, username, password, callback) {
  
   if(DeviceList.VerifyAuth(username,password)){
 

    console.log("Pre Known Client",client.id,"Connected");
    callback(null, true)
   }
  else if (username == "Register" && password == "Register") {
    //Notify i got a new Record
    console.log("New Client",client.id,"Recored");
    //generate a new Client Record
    let Client=new MqttClient(client.id);
    DeviceList.addNewClientRecord(Client);

    //Deny Client (Must use Generated Creds)
    callback(new MqttErrorObj("Auth error",4) , null);
    console.log("Client Ejected",client.id);
    
    
  } 
  else {
    console.log(client)
    let error=new MqttErrorObj("Auth error",4);
    callback(error, null);
    console.log("Client Denined make sure it is AUTH",client.id);
  }

};



const express = require('express')
const app = express()
const EXport = 3002
import {MPI}from "./MQTT/MQHTTP"


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/', (req, res) => {
console.log("TOGGLE");

MPI.issuePublication("cmnd/json-Bedroom/POWER", "2")


  res.send('Hello World!')
})
app.post('/pub', (req, res) => {
   req.
  
  MPI.issueSub("stat/json-Bedroom/POWER");
  MPI.issueSub("stat/json-Bedroom/RESULT")
  
  
    res.send('Hello World!')
  })

app.listen(EXport, () => {
  console.log(`EXPample app listening at http://localhost:${EXport}`)
})

                        