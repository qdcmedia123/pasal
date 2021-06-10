import rabbit, { Channel } from "amqplib";

class RabbitMQWrapper {
  private _client?: Channel;

  get client() {
    if(!this._client) {
      throw new Error(`Could not connect to Rabbit`);
    }

    return this._client;
  }
  
  async connect(url: string, queuGroupName:string, exch:string, queueOptions:object = {}, rkey: string ) {
    try {
      const con = await rabbit.connect(url, "heartbeat=60");
      const ch = await con.createChannel();
      await ch.assertExchange(exch, 'direct', {durable: true}).catch(console.error);
      await ch.assertQueue(queuGroupName, queueOptions);
      await ch.bindQueue(queuGroupName, exch, rkey).catch(console.error);
      this._client = ch;
      console.log('Connected to RabbitMQ Server !');
      return ch;
    } catch (err) {
      throw new Error(`Can not connect to rabbit mq server`+ err, );
    }
  }

  test() {
    return 'hello world'
  }
}

export const rabbitMQWrapper = new RabbitMQWrapper();
