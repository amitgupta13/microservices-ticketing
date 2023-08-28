import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  return ticket;
};

const createOrder = (cookie: string[], ticket: TicketDoc) =>
  request(app).post("/api/orders").set("Cookie", cookie).send({
    ticketId: ticket.id,
  });

it("fetches orders for a particular user", async () => {
  // Create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = signin();
  const userTwo = signin();
  // Create one order as User #1
  await createOrder(userOne, ticketOne);
  // Create 2 orders as user #2
  const { body: orderOne } = await createOrder(userTwo, ticketTwo);
  const { body: orderTwo } = await createOrder(userTwo, ticketThree);
  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send()
    .expect(200);
  // Make sure we only got orders for user #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
