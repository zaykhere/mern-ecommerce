const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const {protect, admin} = require("../middlewares/authMiddleware.js");

router.get("/all", asyncHandler(async(req,res)=>{
	const products = await Product.find({});
	if(!products) return res.json("No product found");
	res.status(200).json({products});
}))

router.get("/", asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword ? {
		name: {
			$regex: req.query.keyword,
			$options: 'i'
		}
	} : {}

	const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize*(page-1));
    if(!products) return res.status(404).json({ error: "Products not found" });
    res.json({products,page,pages: Math.ceil(count/pageSize)});
  
}))

router.get("/:id", asyncHandler(async (req, res) => {
  
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
      
  }
    res.json(product);
    
}))

// Delete a product
router.delete("/:id", protect, admin, asyncHandler(async(req,res)=>{
	const product = await Product.findById(req.params.id);

	if (product) {
		await product.remove();
		res.json({message: "Product Removed"});
	}
	else {
		res.status(404).json({error: "Product not found"});
	}
}))

// Create a prodct 
router.post("/", protect, admin, asyncHandler(async(req,res)=> {
	const product = new Product({
		name: 'Sample product',
		price: 100,
	 	user: req.user._id,
	 	image: '/images/alexa.jpg',
	 	brand: "Sample Brand",
	 	category: "Sample category",
	 	description: "Sample description",
	 	countInStock: 5,
	 	numReviews: 0
	})

	const createdProduct = await product.save();
	res.json(product);
}))

//Update a product

router.put("/:id", protect, admin, asyncHandler(async(req,res)=>{
	const product = await Product.findById(req.params.id);

	if(product) {
		product.name= req.body.name || product.name;
		product.price= req.body.price || product.price;
	 	product.user= req.user._id || product.user;
	 	product.image=  req.body.image;
	 	product.brand= req.body.brand || product.brand;
	 	product.category= req.body.category || product.category;
	 	product.description= req.body.description || product.description  ;
	 	product.countInStock= req.body.countInStock || product.countInStock  ;
	 	product.numReviews= 0 || product.numReviews; 

	 	const updatedProduct = await product.save();
	 	res.json(updatedProduct);
	}

	else {
		res.status(201).json({error: "Product not found"});
	}

}))

// Create A Review
router.post("/:id/reviews", protect, asyncHandler(async(req,res)=>{
	const {rating,comment} = req.body;

	const product = await Product.findById(req.params.id);

	if(product) {
		const alreadyReviewed = product.reviews.find(r=> r.user.toString()===req.user._id.toString());
		if(alreadyReviewed) {
			return res.status(401).json({error:"Product already reviwed"})
		}
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id
		};

		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		product.rating = (product.reviews.reduce((acc,item)=> item.rating+ acc, 0) / product.reviews.length);
		await product.save();
		res.status(201).json({message: "Review Added"});
	}
	else{
		res.status(404).json({error: "Product not found"});
	}

}))

// Get Top Rated products 
router.get("/rated/top", asyncHandler(async(req,res)=>{
	const products = await Product.find({}).sort({rating: -1}).limit(3);
	res.json(products);
}))

module.exports = router;
