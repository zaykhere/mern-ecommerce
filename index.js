const express= require("express");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const {errorHandler, notFound } = require("./middlewares/errorMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const app = express();


if(process.env.NODE_ENV==='development'){
	app.use(morgan('dev'));
}


app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://musing-northcutt-7948aa.netlify.app"
    ],
    credentials: true,
  })
);

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100
})
app.use(limiter);

dotenv.config({path:'./config.env'});

// Import Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoute = require("./routes/paymentRoute");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// Middlewares  


app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(hpp());

//Routes 
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/", paymentRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//Error handling
app.use(notFound);
app.use(errorHandler);

//DB
const connectDB = process.env.CONNECTION_STRING;
mongoose.connect(connectDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
	.then(()=> console.log("Connected to Database"))
	.catch((err)=> console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));

