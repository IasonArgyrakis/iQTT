import { iQTT } from "../../MQTT/MQHTTP";

import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
const adapter = new FileSync("Broker-API/Tasmota/DeviceList.json");
const db = low(adapter);

interface TasmoDev {
  device_Name: String;

  data?: TasmoMsg[];
  //stat?: TasmoMsg[];
}
interface TasmoMsg {
  property_Name: string;
  data: any;
}

class _tasmotaControler {
  _allowedComnads = ["Power", "powerOnState", "TelePeriod"];
  _tasmota_rooots = ["tele", "stat"];

  constructor() {
    db.defaults({ Tasmota_Devices: [] }).write();
  }

  public sendCommand(client, cmnd, paylaod) {
    if (this._allowedComnads.includes(cmnd)) {
      iQTT.publishTo("cmnd/" + client + "/" + cmnd, paylaod);
    } else console.log("no PERMISION");
  }
  public getTasmoDevList() {
    return db.get("Tasmota_Devices");
  }
  /**
   * DetectTasmoMsg
topic,msg   */
  public DetectTasmoMsg(topic, msg) {
    topic = topic.split("/");
    let rooot = topic[0];
    let device_name = topic[1];
    let _property = topic[2];
    msg = msg.toString();
    if (this._tasmota_rooots.includes(rooot)) {
      if (
        db.get("Tasmota_Devices").find({ device_Name: device_name }).value() ==
        undefined
      ) {
        db.get("Tasmota_Devices")
          .push({ device_Name: device_name, data: [] })
          .write();
      }

      let old: TasmoDev = db
        .get("Tasmota_Devices")
        .find({ device_Name: device_name })
        .value();
     
      let new_data: TasmoMsg = { property_Name: _property, data: msg };
      if (old.data.length == 0||old.data.find( ({ property_Name }) => property_Name == _property )==undefined) {
       
        old.data.push(new_data);
     
      } 
      else{
        let update_known:TasmoMsg =old.data.find( ({ property_Name }) => property_Name == _property )
        update_known.data=msg
        
        

      }
      }
    }
    //else ignore not tasmota
  }


let _tasmco = new _tasmotaControler();
export { _tasmco as tasmCo };
