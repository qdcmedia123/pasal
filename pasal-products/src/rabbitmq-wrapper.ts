// @ts-nocheck
import { config } from "./config/rabbit";
import Rascal, { Broker } from "rascal";

const MBroker = Rascal.BrokerAsPromised;

class RabbitMQWrapper {
  private _client?: Broker;

  get client() {
    if (!this._client) {
      throw new Error(`Could not connect to Rabbit`);
    }

    return this._client;
  }

  async connect() {
    try {
      const broker = await MBroker.create(config);
      this._client = broker;
      console.log('Connected to RabbitMQ server');
      broker.on("error", console.error);
    } catch (err) {
      console.console(err);
    }
  }

}

export const rabbitMQWrapper = new RabbitMQWrapper();
