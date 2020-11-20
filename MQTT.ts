import{MqttErrorObj,MqttClient,MqttDeviceList} from "./MQTT/MqttObj";

const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const port = 1883;

/*
const options = {
  key: fs.readFileSync('src/keys/server.pem'),
  cert: fs.readFileSync('src/keys/private2.pub')
}
*/
/*const server = require('tls').createServer(
    //options,
     aedes.handle)
*/
server.listen(port, function () {
  console.log("server started and listening on port ", port);
});

const DeviceList =new MqttDeviceList()
aedes.authenticate = async function (client, username, password, callback) {
  
   if(DeviceList.isAuthorized(username,password)){


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
    let error=new MqttErrorObj("Auth error",4);
    callback(error, null);
    console.log("Client Denined",client.id);
  }

};

