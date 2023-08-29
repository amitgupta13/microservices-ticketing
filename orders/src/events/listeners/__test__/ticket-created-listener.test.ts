import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";
import { TicketCreatedEvent } from "@agticket13/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call onMesasge fn with data and message objects
  await listener.onMessage(data, msg);

  // make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call onMesasge fn with data and message objects
  await listener.onMessage(data, msg);

  // write assertions to make sure ack fn was called
  expect(msg.ack).toHaveBeenCalled();
});
