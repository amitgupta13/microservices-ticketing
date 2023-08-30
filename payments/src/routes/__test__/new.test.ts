import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/Order";
import { OrderStatus } from "@agticket13/common";
import { stripe } from "../../stripe";

it("returns a 404 when purchasing an order that does not exist", async () =>
  request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "test",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404));

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "test",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId,
    version: 0,
    status: OrderStatus.Cancelled,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "test",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    userId,
    version: 0,
    status: OrderStatus.Created,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.paymentIntents.create as jest.Mock).mock
    .calls[0][0];

  expect(chargeOptions.payment_method).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");
});
