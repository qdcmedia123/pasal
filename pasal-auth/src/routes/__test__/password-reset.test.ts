import request from "supertest";
import { app } from "../../app";

const permission = {
  name: "list_leads",
  cat: "ifa",
  guard_name: "sales",
  role: "sales executive",
};

it("throw 400 bad request error if no email address is supplied", async () => {
  await request(app)
    .post("/api/users/request_reset_password")
    .send({})
    .expect(400);
});

it("400 bad request error if user is not found", async () => {
  await request(app)
    .post("/api/users/request_reset_password")
    .send({ email: "bharatrose1@gmail.com" })
    .expect(400);
});

it("create permission, users and password request", async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send(permission)
    .expect(200);

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
      permissions: ["list_leads"],
    })
    .expect(201);

  const { email } = JSON.parse(response.text);

  await request(app)
    .post("/api/users/request_reset_password")
    .send({ email })
    .expect(201);
});

it("throw 400 error if code is not provided", async () => {
  await request(app)
    .post("/api/users/updated_password")
    .send({ df: "fg" })
    .expect(400);
});

it("400 error if both password is not identical", async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send(permission)
    .expect(200);

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
      permissions: ["list_leads"],
    })
    .expect(201);

  const { email } = JSON.parse(response.text);

  const passwordRequest = await request(app)
    .post("/api/users/request_reset_password")
    .send({ email })
    .expect(201);
    
  const decodeResponse = JSON.parse(passwordRequest.text);

  const invalidConPass = await request(app)
    .post("/api/users/updated_password")
    .send({
      code: decodeResponse.code,
      user_id: decodeResponse.user_id,
      password: "hello",
      confirmPassword: "hell",
    })
    .expect(400);

  const errors = JSON.parse(invalidConPass.text);
  expect(errors.errors[0].message).toBeDefined();
  expect(errors.errors[0].message).toContain("Both password did not match");

});


it("Will finall update the password with status kye 400", async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send(permission)
    .expect(200);

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
      permissions: ["list_leads"],
    })
    .expect(201);

  const { email } = JSON.parse(response.text);

  const passwordRequest = await request(app)
    .post("/api/users/request_reset_password")
    .send({ email })
    .expect(201);
  const decodeResponse = JSON.parse(passwordRequest.text);

  const invalidConPass = await request(app)
    .post("/api/users/updated_password")
    .send({
      code: decodeResponse.code,
      user_id: decodeResponse.user_id,
      password: "hello",
      confirmPassword: "hell",
    })
    .expect(400);

  const errors = JSON.parse(invalidConPass.text);
  expect(errors.errors[0].message).toBeDefined();
  expect(errors.errors[0].message).toContain("Both password did not match");
  
  const updatePassword = await request(app)
    .post("/api/users/updated_password")
    .send({
      code: decodeResponse.code,
      user_id: decodeResponse.user_id,
      password: "thisismylife",
      confirmPassword: "thisismylife",
    })
    .expect(204);
});