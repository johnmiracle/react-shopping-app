import express from "express";
import Order from "../models/Order";
import { isAuth, isAdmin } from "../config";

const router = express.Router();

router.post("/", isAuth, async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });
  const newOrderCreated = await newOrder.save();
  res.status(201).send({ message: "New Order Created", data: newOrderCreated });
});

router.get("/:id", isAuth, async (req, res) => {
  const order = await Order.findById({ _id: req.params.id }).populate("user");
  if (order) {
    res.send(order);
  } else {
    res.status(404).send("Order Not Found.");
  }
});
router.get("/mine", isAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

router.get("/", isAuth, async (req, res) => {
  const orders = await Order.find({}).populate("user");
  res.send(orders);
});

module.exports = router;
