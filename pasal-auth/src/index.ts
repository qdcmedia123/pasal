import { app } from "./app";
import mongoose from 'mongoose';
import rabbit from 'amqplib';
const queueOptions = {durable:true, exclusive:false, autoDelete: false};
const queuGroupName = 'ticket:create';
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
    console.log('connected to mongod');
    } catch (error) {
        console.log(error);
    }

    try {
        const conn = await rabbit.connect(process.env.RABBIT_MQ_URL);
        const ch = await conn.createChannel();
        try {
            await ch.assertQueue(queuGroupName , queueOptions);
            // You can set alot of settings here 
             ch.consume(queuGroupName, function(msg) {
                if (msg !== null) {
                  console.log(`message received from ${queuGroupName}`, JSON.parse(msg.content.toString()));
                  ch.ack(msg);
                }
              });
        } catch (err) {
            console.log(err);
        }
        
    } catch (err) {
        console.log(err)
    }
    
} 
start();

app.listen(3000, () => {
    console.log(`Listening on port 3000`)
});