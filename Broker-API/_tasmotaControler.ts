import { iQTT } from "../MQTT/MQHTTP";

class _tasmotaControler {


  constructor() { }
  _allowedComnads=
  ["power","powerOnState","TelePeriod" 

  ]
  public sendCommand(client,cmnd,paylaod) {
      if(this._allowedComnads.includes(cmnd))
      {
          iQTT.publishTo("cmnd/"+client+"/"+cmnd,paylaod)
      }
      else(console.log("no PERMISION"))
  }
  public getList(){return iQTT.getDevices()}
  
}
let _tasmco=new _tasmotaControler();
export {_tasmco as tasmCo}
