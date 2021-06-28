import  {MqttClient}   from 'mqtt';

import{MqttErrorObj,MQTTClient,MqttDeviceList} from "./MQTT/MqttObj";

import * as fs from "fs";
import{HTTPAPI} from "./Broker-API/Api"

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
  HTTPAPI.startSecure;
  HTTPAPI.startUnSecure;
  console.log("MQTT BROKER started and listening on port ", port);
  
});

const DeviceList =new MqttDeviceList()
aedes.authenticate =  function (client, username, password, callback) {
  
  
  //console.log(username,password)
   

  if (username == "Register" && password == "Register")
   {
    callback(new MqttErrorObj("Auth error",4) , null);
    //Notify i got a new Record
    console.log("New Client",client.id,"Recored");
    //generate a new Client Record
    var Client=new MQTTClient(client.id);
     DeviceList.addNewClientRecord(Client);

    //Deny Client (Must use Generated Creds)
    
    console.log("Client Ejected",Client.DeviceId);
    
    
  } 
  else if( DeviceList.VerifyAuth(username,password)){
 

    console.log("Pre Known Client",client.id,"Connected");
    callback(null, true)
   }

  else
   {
    //console.log(client)
    let error=new MqttErrorObj("Auth error",4);
    callback(error, null);
    console.log("Client Denined NO REC",client.id);
  }

};



                        