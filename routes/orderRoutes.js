const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const {protect,admin} = require("../middlewares/authMiddleware");
const Product = require("../models/productModel");

const router = express.Router();

//Create Order
router.post("/", protect ,asyncHandler(async(req,res)=>{
	const {orderItems, shippingAddress, totalPrice} = req.body;

	if(orderItems && orderItems.length===0) {
		return res.status(400).json({error: "No order items"});
	}
	else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			totalPrice
		})

		const createdOrder = await order.save();
		for (const item of order.orderItems) {
			const product = await Product.findById(item.product);
			product.countInStock = product.countInStock - item.qty;
			await product.save();
		}
		res.status(200).json({createdOrder: createdOrder})
	}
}))

// Get all orders
router.get("/all" , protect, admin, asyncHandler(async(req,res)=>{
	
		const orders = await Order.find({}).populate("user","id name");
		if(!orders) return res.status(404).json("Sorry there have been no orders yet");
		res.json(orders);	
}))

//Get orders of a single user
router.get("/", protect, asyncHandler(async(req,res)=>{
	const orders = await Order.find({user: req.user._id});
	if(!orders) return res.json({message: "You have no orders"});
	res.json({orders:orders});
}))

// Get order by order ID
router.get("/:id", asyncHandler(async(req,res)=>{
	const order = await Order.find({_id: req.params.id});
	if(!order) return res.json({error: "Order does not exist"});
	res.json({order:order});
}))

// Update order to delivered status
router.put("/:id/deliver", protect, admin, asyncHandler(async(req,res)=>{
	const order = await Order.findById(req.params.id);
	if(order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	}
	else {
		res.status(404).send("Order not found");
	}

}))

module.exports = router;

