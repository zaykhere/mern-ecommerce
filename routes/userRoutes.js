const asyncHandler = require("express-async-handler");
const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const generateToken = require("../utils/genToken");
const { protect, admin } = require("../middlewares/authMiddleware");

router.post("/login",asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No user exists with the entered email" });
    
    const matchPassword = await user.matchPassword(password);
    if (matchPassword) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id) 
      })
    }
    else {
      res.status(401).json({error: "Invalid email or password"});
      
    }

  } catch (error) {
    console.log(error);
    
  }
}))

router.post("/", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) return res.status(400).json({ error: 'User already exists' });

  const user = await User.create({
    name,
    email,
    password
  })

  if(user){
     res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  })
  }

  else {
    res.status(400)
    throw new Error("Invalid user data");
  }

}))


router.get("/profile", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }

  else {
    res.status(404).json({ error: "User not found" });
  }

}))

// Update profile
router.put("/profile", protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name ;
    user.email = req.body.email || user.email ;
    if(req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

     res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id) 
      })
  }

  else {
    res.status(404)
    throw new Error("User not found");
  }

}))

router.get("/", protect, admin ,asyncHandler(async(req,res)=>{
  const users = await User.find();
  res.json({users: users});
}))

// Delete User
router.delete("/:id", protect, admin, asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id);
  if(user) {
    await user.remove();
    res.json({message: "User removed"})
  }
  else {
    res.status(404).send("User not found");
  }

}))

// Get User By ID
router.get("/:id", protect, admin, asyncHandler(async(req,res)=>{
  const user = await User.findById(req.params.id).select('-password');
  if(user) {
    res.json(user);
  }
  else {
    res.status(404).send("User not found");
  }
}))

// Route for admin to update any user profile
router.put("/:id", protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name ;
    user.email = req.body.email || user.email ;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

     res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
  }

  else {
    res.status(404)
    throw new Error("User not found");
  }

}))


module.exports = router;
