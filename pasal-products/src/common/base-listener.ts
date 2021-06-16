// @ts-nocheck
import { Broker, AckOrNack } from "rascal";
import { Message } from "amqplib";

interface Event {
  data: any;
  subject: string;
}

abstract class Listener<T extends Event> {
  abstract queueGroupName: string;
  public client: Broker;
  abstract onMessage(data: T["data"], message: any, ackOrNack: AckOrNack): void;

  public msg: any;

  constructor(client: Broker) {
    this.client = client;
  }

  async listen() {
    console.log(`Listening to message on subject ${this.queueGroupName}`);
    const broker = this.client;
    broker.on("error", console.error);
    const subscription = await broker.subscribe(this.queueGroupName, "b1");
    subscription.on("message", (message, content, ackOrNack) => {
      this.onMessage(JSON.parse(content), message, ackOrNack);
      // Do not cancel the subscription because other service might has been listening
      // The event
      //subscription.cancel();
    });
    subscription.on("error", console.error);
    subscription.on("invalid_content", (err, message, ackOrNack) => {
      console.log("Failed to parse message");
    });
  }
}

export { Listener };
