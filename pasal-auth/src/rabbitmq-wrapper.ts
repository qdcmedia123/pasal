//import { config } from "./config/rabbit";
import { config } from '@pasal/common';
import { BrokerAsPromised, withDefaultConfig } from "rascal";

class RabbitMQWrapper {
  private _client?: BrokerAsPromised;

  get client() {
    if (!this._client) {
      throw new Error(`Could not connect to Rabbit`);
    }

    return this._client;
  }

  async connect() {
    try {
      const broker = await BrokerAsPromised.create(withDefaultConfig(config));
      this._client = broker;
      broker.on("error", console.error);
      console.log('Connected to RabbitMQ Server')
    } catch (err) {
      console.log(err);
    }
  }
}

export const rabbitMQWrapper = new RabbitMQWrapper();
