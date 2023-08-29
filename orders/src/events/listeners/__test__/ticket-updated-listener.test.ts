import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketCreatedEvent } from "@agticket13/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 20,
  });

  await ticket.save();

  // Create a fake data obj
  const data: TicketCreatedEvent["data"] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
    title: "test 2",
    price: 10,
  };

  // Create a fake msg obj
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of it
  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { listener, msg, data, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call onMesasge fn with data and message objects
  await listener.onMessage(data, msg);

  // write assertions to make sure ack fn was called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version", async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  // call onMesasge fn with data and message objects
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  // write assertions to make sure ack fn was called
  expect(msg.ack).not.toHaveBeenCalled();
});
