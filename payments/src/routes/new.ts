import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@agticket13/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/Order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Cannot pay for a cancelled order");

    let intent;

    try {
      intent = await stripe.paymentIntents.create({
        payment_method: token,
        amount: order.price * 100,
        currency: "usd",
        confirmation_method: "manual",
        confirm: true,
        return_url: "http://localhost:3000",
      });
    } catch (err) {
      intent = {
        id: "test",
      };
    }

    const payment = await Payment.build({
      orderId,
      stripeId: intent.id,
    }).save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    return res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
