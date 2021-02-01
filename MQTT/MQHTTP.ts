import * as mqtt from "mqtt";
import * as tls from "tls"

var server1 = {
  url: "mqtts://Home-server:8883",
  opt: { username: "API+67", password: "042f", clientId: "API",rejectUnauthorized: false},
};

let Devicelist=[]

class MQHTTP {
  private broker;
 
 
  constructor(options) {
    
    this.broker = mqtt.connect(options.url, options.opt);
    this.broker.on("message", function (topic, message) {
        // message is Buffer
        console.log("+++>>>"+topic +": "+message.toString());
        //if(topic
        let str= topic.split("/")
      
        if(!Devicelist.includes(str[1]))
        {
          Devicelist.push(str[1])
        }
        

    
        
      })
      

  }
  
  public publishTo(topic, payload) {
    console.log("Publising: "+topic+"  Payload: "+payload);
    this.broker.publish(topic, payload );
  }
  public subscribeTo(topic) {
    console.log("MQTT api Subcribed to:"+topic)
    this.broker.subscribe(topic)

  }
  public getDevices(){return Devicelist}
 
  
}

var MPI = new MQHTTP(server1);

export { MPI as iQTT};
