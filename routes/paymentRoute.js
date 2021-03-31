const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/payment", async(req,res)=>{
	let {amount,id} = req.body;
	console.log(amount, id);
	try{
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "MERN ECOMMERCE",
			payment_method: id,
			confirm: true
		})
		res.json({
			message: "Payment successful",
			success: true
		})
	}
	catch(error){
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})

module.exports = router;
