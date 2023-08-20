import request from "supertest";
import { app } from "../../app";

it("should return a 201 on successful signup", () =>
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201));

it("should return a 400 bad request with invalid email", () =>
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "password",
    })
    .expect(400));

it("should return a 400 bad request with invalid password", () =>
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "pas",
    })
    .expect(400));

it("should return a 400 bad request with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({ password: "pass" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
