import request from "supertest";
import { app } from "../../app";

const permission = {
  name: "list_leads",
  cat: "ifa",
  guard_name: "sales",
  role: "sales executive",
};

beforeEach(async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send(permission)
    .expect(200);
});

it("throw 401 error, if username and the password is not provided", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("usetype must be present while doing registration", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "bharatrose1@gmail.com", password: "thisismylife" })
    .expect(400);
});

it("return with 400 with invalid passwod", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@",
      password: "pas",
    })
    .expect(400);
});

it("return a 400 with missing email and password", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

it("throws 400 error if no permission is provided", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
    })
    .expect(400);
});

it("registered user, if username, password and usertype is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
      permissions: ["list_leads"],
    })
    .expect(201);
});

it("disallowed duplicate email, usertype registration", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
      permissions: ["list_leads"]
    })
    .expect(201);

    await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      usertype: "seller",
      permissions: ["list_leads"],
    })
    .expect(400);
});

it("will register user with same email but different usertype", async() => {
  await request(app)
  .post("/api/users/signup")
  .send({
    email: "bharatrose1@gmail.com",
    password: "thisismylife",
    usertype: "seller",
    permissions: ['list_leads']
  })
  .expect(201);

  await request(app)
  .post("/api/users/signup")
  .send({
    email: "bharatrose1@gmail.com",
    password: "thisismylife",
    usertype: "buyer",
    permissions: ['list_leads']
  })
  .expect(201);
});

it('will set cookie to client after sucessfull, registration', async() => {
  const response = await request(app)
  .post("/api/users/signup")
  .send({
    email: "bharatrose1@gmail.com",
    password: "thisismylife",
    usertype: "seller",
    permissions: ['list_leads']
  })
  .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('throw 400 bad request error, if permission provided which is not exists', async() => {
  const response = await request(app)
  .post("/api/users/signup")
  .send({
    email: "bharatrose1@gmail.com",
    password: "thisismylife",
    usertype: "buyer",
    permissions: ['not_exists']
  })
  .expect(400);
  const parseText = JSON.parse(response.text);
  expect(parseText.errors).toBeDefined();
});