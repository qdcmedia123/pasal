
// @ts-nocheck
import rabbit from "amqplib";
import { queueGroupName } from "./common/queu-group-name";
import { config } from './config/rabbit';
import Rascal, { Broker } from 'rascal';


const MBroker = Rascal.BrokerAsPromised;


class RabbitMQWrapper {
  private _client?: Broker;

  get client() {
    if(!this._client) {
      throw new Error(`Could not connect to Rabbit`);
    }

    return this._client;
  }
  
  async connect (queueGroupName:string) {
    console.log("Publishing Event");
    var msg = 'Hello World!';
    const broker = await MBroker.create(config);
    this._client = broker;
    broker.on('error', console.error);
    // const publication = await broker.publish(queueGroupName, msg);
    // publication.on('error', console.error);
    // console.log("Published")

  }
 


 
}

export const rabbitMQWrapper = new RabbitMQWrapper();
