import * as mqtt from "mqtt";
import { IClientOptions, IClientPublishOptions } from "mqtt";
import * as tls from "tls"
import { tasmCo } from "../Broker-API/Tasmota/_tasmotaControler";
import { MqttClient } from "mqtt";
 


var option:IClientOptions={ username: "API+24", password: "13a2", clientId: "API",rejectUnauthorized: false}

var server1 = {
  url: "mqtts://Home-server:8883",
  opt:option
};

class MQHTTP {
  private broker:MqttClient;
 
  
  constructor(options) {
    
    this.broker = mqtt.connect(options.url, options.opt);
    this.broker.on("message", function (topic, message) {
        // message is Buffer
        console.log("+++>>>"+topic +" : "+ message.toString());
      
        tasmCo.DetectTasmoDevices(topic,message)
        

    
    
      })
      

  }
  
  public publishTo(topic, payload,qos?:mqtt.QoS) {
    let opt:IClientPublishOptions={"qos":qos}
    console.log("Publising:->"+topic+"<   |Payload:>"+payload+"<  |qos>"+qos );
    this.broker.publish(topic, payload,opt,(erro)=>{console.log(erro)});
  }
  public subscribeTo(topic) {
    console.log("MQTT api Subcribed to:"+topic)
    this.broker.subscribe(topic)

  }
  public getTasmoDevices(){return tasmCo.getTasmoDevList  }
 
  
}

var MPI = new MQHTTP(server1);


export { MPI as iQTT};

