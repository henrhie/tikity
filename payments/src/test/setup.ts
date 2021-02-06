import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
import { json } from "express";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[]
    }
  }
}

jest.mock('../nats-wrapper');
jest.mock('../stripe');

process.env.STRIPE_KEY='sk_test_51EhaveLypyYIcsTVs2Uw2z1yDo2vd3cNEDl2YibFwhKndPSfXITmjkQzxB1fXhwqpGJxxFnhUeN4pELg4g47QseV00tD9QyJzV'

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf"
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
})

global.signin = (id?: string) => {
  //build a jwt payload with id and email
  const token = jwt.sign({
    email: "test@test.com",
    id: id || new mongoose.Types.ObjectId().toHexString()
  }, process.env.JWT_KEY!)
  //build session object. { jwt: MY_JWT }
  const sessionObj = { jwt: token }
  //turn that sessions into json
  const jsonSesson = JSON.stringify(sessionObj);
  //take json and ecode it as base64
  const base64 = Buffer.from(jsonSesson).toString("base64");
  //return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
}