import request from "supertest";
import { app } from "../../app";

it("create user and clear the session", async () => {
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

  const logout = await request(app).get("/api/users/signout").expect(200);
  expect(logout.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
