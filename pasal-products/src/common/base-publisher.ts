import { Message, Channel} from 'amqplib';

const exch = 'test_exchange';
const rkey = 'rest_route';

interface Event {
    data: any
}

export abstract class Publisher <T extends Event> {
 
    public client: Channel;

    constructor(client: Channel) {
        this.client = client;
    }

    async publish(data: T['data']): Promise<void> {
       try {
        await  this.client.publish(exch, rkey, Buffer.from(JSON.stringify(data)));
       } catch (err) {
           throw new Error(err);
       }
       
    }
}