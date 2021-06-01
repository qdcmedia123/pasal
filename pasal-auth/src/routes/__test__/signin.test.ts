import request from "supertest";
import { app } from "../../app";

it("throw 400 error when no email supplied", async () => {
  await request(app).post("/api/users/signin").send({}).expect(400);
});

it("throw 400 error when invalid email supplied email supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "asdfsf" })
    .expect(400);
});

it("throw 400 error when no password supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "asdfsf@gmail.com" })
    .expect(400);
});

it("faild when invalid username and password is provided", async () => {
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "bharatrose1@gmail.com",
      password: "password",
    })
    .expect(400);
  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors[0].message).toEqual("Invalid credentials");
});

it("success with 201 when valid username and password is provided", async () => {
  const permission = {
    name: "list_leads",
    cat: "ifa",
    guard_name: "sales",
    role: "sales executive",
  };
  await request(app)
    .post("/api/users/permission/create")
    .send(permission)
    .expect(200);

  // Create user
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
      permissions: ["list_leads"],
    })
    .expect(201);

  // Now lets try to login
  const login = await request(app)
    .post("/api/users/signin")
    .send({ email: "bharatrose1@gmail.com", password: "thisismylife" })
    .expect(201);
    const parseResponse = JSON.parse(login.text);
   
    expect(login.get("Set-Cookie")).toBeDefined();
});
