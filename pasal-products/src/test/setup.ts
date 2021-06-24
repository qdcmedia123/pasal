import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";

let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock("../rabbitmq-wrapper");

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_KEY = "asdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const payload = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: "bharatrose1@gmail.com",
    permissions: ["create_product"],
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session variabl
  const session = { jwt: token };

  // Take json and encode it as base64
  const sessionJSON = JSON.stringify(session);

  // Create buffer
  const buffer64 = Buffer.from(sessionJSON).toString("base64");

  // Return a string that the cookie with the encoded fuffer 64
  return [`express:sess=${buffer64}`];
};
