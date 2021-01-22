import * as mqtt from "mqtt";

var server1 = {
  url: "mqtt://Home-server:3000",
  opt: { username: "API+67", password: "042f", clientId: "API",qos: 2 },
};

class MQHTTP {
  private broker;
  private subscriptions:Array<String>

  constructor(options) {
    this.broker = mqtt.connect(options.url, options.opt);
    this.broker.on("message", function (topic, message) {
        // message is Buffer
        console.log("+++>>>"+topic +": "+message.toString());
    
        
      })
      

  }
  public issuePublication(topic, payload) {
    this.broker.publish(topic, payload );
  }
  public issueSub(topic) {
    this.broker.subscribe(topic)

  }
}

var MPI = new MQHTTP(server1);
export { MPI };
