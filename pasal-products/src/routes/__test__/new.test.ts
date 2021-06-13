import { app } from "../../app";
import request from "supertest";

it("throw 401 un autorized error when there is no authentication", async () => {
  await request(app).post("/api/products/v1/new").send({}).expect(401);
});

it("response with status 400 if user is authenticated", async () => {
  const response = await request(app)
    .post("/api/products/v1/new")
    .set("Cookie", global.signin())
    .send({})
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(5);
});

it("response with status 400 if only name is provided", async () => {
  const response = await request(app)
    .post("/api/products/v1/new")
    .set("Cookie", global.signin())
    .send({ name: "coat" })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(4);
});

it("response with status 400 if only name and category is provided", async () => {
  const response = await request(app)
    .post("/api/products/v1/new")
    .set("Cookie", global.signin())
    .send({ name: "coat", category: "cloth" })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(3);
});

it("response with status 400 if only name and category is provided", async () => {
  const response = await request(app)
    .post("/api/products/v1/new")
    .set("Cookie", global.signin())
    .send({ name: "coat", category: "cloth" })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(3);
});

it("response with status 400 if only name and category, subCagegory is provided", async () => {
  const response = await request(app)
    .post("/api/products/v1/new")
    .set("Cookie", global.signin())
    .send({ name: "coat", category: "cloth", subCategory: "cloth" })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(2);
});

it("response with 201 code when product is created", async () => {
  const response = await request(app)
    .post("/api/products/v1/new")
    .set("Cookie", global.signin())
    .send({
      name: "coat",
      category: "cloth",
      subCategory: "cloth",
      price: 100,
      availableItems: 100,
    })
    .expect(201);
  const parseResponse = JSON.parse(response.text);
  console.log(parseResponse);
  expect(parseResponse.id).toBeDefined();
  expect(Object.entries(parseResponse).length).toStrictEqual(9);
});
