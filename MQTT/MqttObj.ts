import { randomBytes } from "crypto";
import * as low from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";

interface MqttErrorObj extends Error {
  returnCode?: number;
}
class MqttErrorObj implements MqttErrorObj {
  constructor(
    public message: string,
    public returnCode?: number,
    public name: string = "Error"
  ) {}
}
enum clientType{generic,tasmota}

interface MqttClientCofig {
  readonly DeviceId: string;
  readonly username: string;
  readonly password: string;
  readonly isAuthourized: boolean;
  subscriptions?: string[];
  publications?: string[];
  readonly type?: clientType
}

class MqttClient implements MqttClientCofig {
  readonly DeviceId: string;
  readonly username: string;
  readonly password: string;
  readonly isAuthourized: boolean = false;
  subscriptions: string[] = [];
  publications: string[] = [];
  readonly type:clientType

  constructor(
    DeviceId: string,
    subscriptions?: string[],
    publications?: string[],
    type?:clientType
  ) {
    this.DeviceId = DeviceId;
    this.username = DeviceId + "+" + randomBytes(1).toString("hex");
    this.password = randomBytes(2).toString("hex");
    if (subscriptions == undefined) {
      this.subscriptions = [];
    } else {
      this.subscriptions = subscriptions;
    }
    if (publications == undefined) {
      this.publications = [];
    } else {
      this.publications = publications;
    }

    if (type == undefined) {
      this.type = 0;
    } else {
      this.type = type;
    }

    let MqttDevice = {
      DeviceId: this.DeviceId,
      username: this.username,
      password: this.password,
      subscriptions: [],
      publications: this.publications,
    };
  }
}

const adapter = new FileSync("./MQTT/RegisteredDev.json");
const db = low(adapter);

class MqttDeviceList {
  public addNewClientRecord(client: MqttClient) {
    if (
      db.get("Devices").find({ DeviceId: client.DeviceId }).value() == undefined
    ) {
      console.log("New Device Recorded");
      db.get("Devices").push(client).write();
    } else {
      console.log(
        "Device Duplicate(IGNORED)-Update Client Creds and RegisteredDev.json and Restart"
      );
    }
  }
  public VerifyAuth(username, password) {
    let query:MqttClient = db
      .get("Devices")
      .find({ username: username }, { password: password })
      .value();

    if (query == undefined || query.isAuthourized == undefined) {
      console.log("Device is know but authorisaion boolean is set to :FALSE")
      return false;
    } else return query.isAuthourized;
  }
  public VerifyPubTopic(clientId,topic){
    let query :MqttClient = db
      .get("Devices")
      .find({ DeviceId: clientId })
      .value();

    console.log(query);
    if(query.DeviceId==clientId && query.publications.includes(topic)){
        return true }
        else {return false}
  }
}
export { MqttErrorObj, MqttClient, MqttDeviceList };
