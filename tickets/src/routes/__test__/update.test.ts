import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if provided id does not exist", () =>
  request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", signin())
    .send({
      title: "test",
      price: 20,
    })
    .expect(404));

it("returns a 401 if user is not authenticated", async () =>
  request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({
      title: "test",
      price: 20,
    })
    .expect(401));

it("returns a 401 if user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title: "test",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send({
      title: "test",
      price: 20,
    })
    .expect(401);
});

it("returns a 400 if user provides invalid title or price", async () => {
  const cookie = signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test2",
      price: -20,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "test2",
      price: 20,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("test2");
  expect(ticketResponse.body.price).toEqual(20);
});
