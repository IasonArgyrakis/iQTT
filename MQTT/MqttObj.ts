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
interface MqttClientCofig {
  readonly DeviceId: string;
  readonly username: string;
  readonly password: string;
  readonly isAuthourized: boolean;
  subscriptions?: string[];
  publications?: string[];
}
class MqttClient implements MqttClientCofig {
  readonly DeviceId: string;
  readonly username: string;
  readonly password: string;
  readonly isAuthourized: boolean = false;
  subscriptions: string[] = [];
  publications: string[] = [];

  constructor(
    DeviceId: string,
    subscriptions?: string[],
    publications?: string[]
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
        "Device Duplicate(IGNORED)-Update Client Creds and RegisteredDev.json"
      );
    }
  }
  public VerifyAuth(username, password) {
    let query = db
      .get("Devices")
      .find({ username: username }, { password: password })
      .value();

    if (query == undefined || query.isAuthourized == undefined) {
      return false;
    } else return query.isAuthourized;
  }
}
export { MqttErrorObj, MqttClient, MqttDeviceList };
