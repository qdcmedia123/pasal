import { app } from "./app";
import mongoose from "mongoose";
import { rabbitMQWrapper } from "./rabbitmq-wrapper";
import { ProductCreatedListener  } from "./events/listeners/product-created-listener";

const queuGroupName = "ticket:create";



const start = async () => {
  if (!process.env.RABBIT_MQ_URL) {
    throw new Error("Rabbit MQ URL is not defined");
  }
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }


  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }

   try {
    const ch = await rabbitMQWrapper.connect();
  } catch (err) {
    console.log(err);
  }

  try {
    new ProductCreatedListener(rabbitMQWrapper.client).listen();
  } catch (err) {
    console.error(err)
  }
 
 
};

start();

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
