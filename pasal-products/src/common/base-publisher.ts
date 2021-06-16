
// @ts-nocheck
import { Broker } from "rascal";

interface Event {
  data: any;
  subject: string;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  public client: Broker;

  constructor(client: Broker) {
    this.client = client;
  }

  async publish(data: T["data"]): Promise<void> {
    try {
      const broker = this.client;
      broker.on("error", console.error);
      const publication = await broker.publish(this.subject, JSON.stringify(data));
      publication.on("error", console.error);
      console.log(`Event has been published for exchange ${this.subject}`);
    } catch (err) {
      throw new Error(err);
    }
  }
}
