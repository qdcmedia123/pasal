import { AckOrNack, BrokerAsPromised } from "rascal";

interface Event {
  data: any;
  subject: string;
}

abstract class Listener<T extends Event> {
  abstract queueGroupName: string;
  public client: BrokerAsPromised;
  abstract onMessage(data: T["data"], message: any, ackOrNack: AckOrNack): void;

  public msg: any;

  constructor(client: BrokerAsPromised) {
    this.client = client;
  }

  async listen() {
    console.log(`Listening to message on subject ${this.queueGroupName}`);
    const broker = this.client;
    broker.on("error", console.error);
    // @ts-ignore
    const subscription = await broker.subscribe(this.queueGroupName, "b1");
    subscription.on("message", (message, content, ackOrNack) => {
      this.onMessage(JSON.parse(content), message, ackOrNack);
      //subscription.cancel();
    });
    subscription.on("error", console.error);
    subscription.on("invalid_content", (err, message, ackOrNack) => {
      console.log("Failed to parse message", err);
    });
  }
}

export { Listener };
