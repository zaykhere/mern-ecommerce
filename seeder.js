const mongoose = require("mongoose");
const dotenv = require("dotenv");
const users = require("./data/users");
const products = require("./data/products");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");

dotenv.config({ path: './config.env' });

//DB
const connectDB = process.env.CONNECTION_STRING;
mongoose.connect(connectDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
	.then(()=> console.log("Connected to Database"))
  .catch((err) => console.log(err));
  
const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = await createdUsers[0]._id;
    const sampleProducts = products.map(p => {
      return {...p, user: adminUser  }
    })

    await Product.insertMany(sampleProducts);
    console.log("Data imported");
    process.exit();
  }
  catch (ex) {
    console.log(ex);
    process.exit(-1);
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data destroyed");
    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
}

if (process.argv[2] === '-d') {
  destroyData();
}

else {
  importData();
}
