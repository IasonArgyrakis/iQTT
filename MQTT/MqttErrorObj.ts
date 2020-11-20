interface MqttErrorObj extends Error { returnCode?: number; }
class MqttErrorObj implements MqttErrorObj {

  constructor(public message: string, public returnCode?: number, public name: string = "Error") { }
}
export{MqttErrorObj}
