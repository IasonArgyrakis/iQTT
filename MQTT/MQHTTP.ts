import * as mqtt from "mqtt";




class MQHTTP
{ 
    public issuePublication(topic:string,payload:string)
    { 
        let  client =  mqtt.connect('mqtt://Home-server:3000',
{
  username:"API+67",
  password:"042f",
  clientId:"API" });
         client.on('connect', function () {
            client.publish(topic, payload,{qos:2});
            client.end();
  });
    }
}
export { MQHTTP}