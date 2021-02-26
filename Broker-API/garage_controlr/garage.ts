import { iQTT } from "../../MQTT/MQHTTP";
import { telegrmClientAPI as telegrmClient } from "../telegram/telegram"
class garageControler {
        _tasmota_rooots = ["Telemetry"];
    private _allowedComnads: ["toggle"];
  
    constructor() {
      
    }
  
    public sendCommand(client, cmnd, paylaod) {
      if (this._allowedComnads.includes(cmnd)) {
        iQTT.publishTo("cmnd/" + client + "/" + cmnd, paylaod);
      } else console.log("no PERMISION");
    }
    
    public DetectGarage(topic, msg) {
      function IsJsonString(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }
      msg=msg.toString();
      console.log(IsJsonString(msg))
      if(topic.toString()=="Telemetry/Door")
      {
         if(msg.IsClosed){telegrmClient.sendMessage(973093704,"Garage Door: Closed " ); }else{telegrmClient.sendMessage(973093704,"Garage Door: **Open**" ); }}
      
  
    }
    //else ignore not tasmota
  }
  
  let _garageco = new garageControler();
  export { _garageco as garageco };
  