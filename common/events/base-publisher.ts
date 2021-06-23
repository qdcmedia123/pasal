import { BrokerAsPromised } from "rascal";

interface Event {
  data: any;
  subject: string;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  public client: BrokerAsPromised;

  constructor(client: BrokerAsPromised) {
    this.client = client;
  }

  async publish(data: T["data"]) {
    try {
      const broker = this.client;

      if (process.env.NODE_ENV !== "test") broker.on("error", console.error);

      const publication = await broker.publish(
        this.subject,
        JSON.stringify(data)
      );

      if(process.env.NODE_ENV !== 'test') publication.on("error", console.error);

      console.log(`Event has been published for exchange ${this.subject}`);
    } catch (err) {
      throw new Error(err);
    }
  }
}
