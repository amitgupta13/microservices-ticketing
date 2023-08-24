import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () =>
  request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({})
    .expect(404));

it("returns a ticket if the ticket is found", async () => {
  const title = "test";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
