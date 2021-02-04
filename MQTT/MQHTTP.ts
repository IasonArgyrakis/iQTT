import * as mqtt from "mqtt";
import * as tls from "tls"
import { tasmCo } from "../Broker-API/Tasmota/_tasmotaControler";


var server1 = {
  url: "mqtts://Home-server:8883",
  opt: { username: "API+67", password: "042f", clientId: "API",rejectUnauthorized: false},
};


class MQHTTP {
  private broker;
 
  
  constructor(options) {
    
    this.broker = mqtt.connect(options.url, options.opt);
    this.broker.on("message", function (topic, message) {
        // message is Buffer
        console.log("+++>>>"+topic +" : "+ message.toString());
      
        tasmCo.DetectTasmoDevices(topic,message)
        

    
    
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
  public getTasmoDevices(){return tasmCo.getTasmoDevList  }
 
  
}

var MPI = new MQHTTP(server1);


export { MPI as iQTT};

