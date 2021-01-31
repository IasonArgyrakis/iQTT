import * as mqtt from "mqtt";
import * as tls from "tls"

var server1 = {
  url: "mqtts://Home-server:8883",
  opt: { username: "API+67", password: "042f", clientId: "API",rejectUnauthorized: false},
};

class MQHTTP {
  private broker;
  private subscriptions:Array<String>

  constructor(options) {
    this.broker = mqtt.connect(options.url, options.opt);
    this.broker.on("message", function (topic, message) {
        // message is Buffer
        console.log("+++>>>"+topic +": "+message.toString());
        //if(topic==)
    
        
      })
      

  }
  public issuePublication(topic, payload) {
    console.log("issuePublication");
    this.broker.publish(topic, payload );
  }
  public issueSub(topic) {
    this.broker.subscribe(topic)

  }
}

var MQTT API = new MQHTTP(server1);
export { MQTT API as MPI };
