// @ts-nocheck
import { app } from "./app";
import mongoose from 'mongoose';
import rabbit from 'amqplib';
import { config } from './config/rabbit';
import Rascal from 'rascal';
const Broker = Rascal.BrokerAsPromised;
const queuGroupName = "product:created";

async function rascal_consume(){
    
    console.log("Consuming");
    const broker = await Broker.create(config);
    broker.on('error', console.error);
    const subscription = await broker.subscribe(queuGroupName, 'b1');
    subscription.on('message', (message, content, ackOrNack)=>{
        console.log(content);
        ackOrNack();
        //subscription.cancel(); Why we cancel the subscription 
    });
    subscription.on('error', console.error);
    subscription.on('invalid_content', (err, message, ackOrNack) =>{
      console.log('Failed to parse message');
    });
  }


const start = async() => {
    if(!process.env.RABBIT_MQ_URL) {
        throw new Error ('Rabbit MQ URL is not defined');
    }
    if(!process.env.JWT_KEY) {
        throw new Error('JWT key must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    try {
        await mongoose.connect(process.env.MONGO_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    console.log('connected to mongodd');
    } catch (error) {
        console.log(error);
    }

    // try {
    //     const conn = await rabbit.connect(process.env.RABBIT_MQ_URL);
    //     const ch = await conn.createChannel();
    //     try {
    //         await ch.assertQueue(queuGroupName , queueOptions);
    //         // You can set alot of settings here 
    //          ch.consume(queuGroupName, function(msg) {
    //             if (msg !== null) {
    //               console.log(`message received from grou ${queuGroupName}`, JSON.parse(msg.content.toString()));
    //               ch.ack(msg);
    //             }
    //           });
    //     } catch (err) {
    //         console.log(err);
    //     };
        
    // } catch (err) {
    //     console.log(err)
    // }
    
    rascal_consume().catch(console.error);
} 
start();

app.listen(3000, () => {
    console.log(`Listening on port 3000 `)
});