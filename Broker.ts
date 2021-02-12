
import{MqttErrorObj,MqttClient,MqttDeviceList} from "./MQTT/MqttObj";
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
  HTTPAPI.start
  console.log("MQTT BROKER started and listening on port ", port);
  
});

const DeviceList =new MqttDeviceList()
aedes.authenticate = async function (client, username, password, callback) {
  
   if( DeviceList.VerifyAuth(username,password)){
 

    console.log("Pre Known Client",client.id,"Connected");
    callback(null, true)
   }
  else if (username == "Register" && password == "Register")
   {
    //Notify i got a new Record
    console.log("New Client",client.id,"Recored");
    //generate a new Client Record
    var Client=new MqttClient(client.id);
     DeviceList.addNewClientRecord(Client);

    //Deny Client (Must use Generated Creds)
    callback(new MqttErrorObj("Auth error",4) , null);
    console.log("Client Ejected",Client.DeviceId);
    
    
  } 
  else {
    //console.log(client)
    let error=new MqttErrorObj("Auth error",4);
    callback(error, null);
    console.log("Client Denined make sure it's AUTH is set to true for :",client.Id);
  }

};



                        