import request from "supertest";
import { app } from "../../app";
import mongoose from 'mongoose';

it("throw 401 un autorized error when there is no authentication", async () => {
    await request(app).put("/api/products/v1/product_id").send({}).expect(401);
});
  
  it("response with status 400 if user is authenticated", async () => {
    const response = await request(app)
      .put("/api/products/v1/product_id")
      .set("Cookie", global.signin())
      .send({})
      .expect(400);
  
    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.errors).toBeDefined();
    expect(parseResponse.errors.length).toStrictEqual(5);
  });
  
  it("response with status 400 if only name is provided", async () => {
    const response = await request(app)
      .put("/api/products/v1/product_id")
      .set("Cookie", global.signin())
      .send({ name: "coat" })
      .expect(400);
  
    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.errors).toBeDefined();
    expect(parseResponse.errors.length).toStrictEqual(4);
  });
  
  it("response with status 400 if only name and category is provided", async () => {
    const response = await request(app)
      .put("/api/products/v1/product_id")
      .set("Cookie", global.signin())
      .send({ name: "coat", category: "cloth" })
      .expect(400);
  
    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.errors).toBeDefined();
    expect(parseResponse.errors.length).toStrictEqual(3);
  });
  
  it("response with status 400 if only name and category is provided", async () => {
    const response = await request(app)
      .put("/api/products/v1/product_id")
      .set("Cookie", global.signin())
      .send({ name: "coat", category: "cloth" })
      .expect(400);
  
    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.errors).toBeDefined();
    expect(parseResponse.errors.length).toStrictEqual(3);
  });
  
  it("response with status 400 if only name and category, subCagegory is provided", async () => {
    const response = await request(app)
      .put("/api/products/v1/product_id")
      .set("Cookie", global.signin())
      .send({ name: "coat", category: "cloth", subCategory: "cloth" })
      .expect(400);
  
    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.errors).toBeDefined();
    expect(parseResponse.errors.length).toStrictEqual(2);
  });

  it("if product not found it will throw 400 error", async() => {
     const id = mongoose.Types.ObjectId().toHexString();
     await request(app)
     .put(`/api/products/v1/${id}`)
     .set("Cookie", global.signin())
     .send({
        name: "coat",
        category: "cloth",
        subCategory: "cloth",
        price: 100,
        availableItems: 100,
      }).expect(404);
  });

  it("creates product and update at the same time", async() => {
    const user = global.signin();
    const updatedProduct = {
        name: "coat",
        category: "cloth",
        subCategory: "cloth",
        price: 100,
        availableItems: 100,
      }

    const response = await request(app)
    .post("/api/products/v1/new")
    .set("Cookie", user)
    .send({
      name: "coat",
      category: "cloth",
      subCategory: "cloth",
      price: 100,
      availableItems: 100,
    })
    .expect(201);

    await request(app)
     .put(`/api/products/v1/${response.body.id}`)
     .set("Cookie", user)
     .send(updatedProduct)
     .expect(200)

  });