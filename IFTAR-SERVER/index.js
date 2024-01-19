const express = require("express");
const app = express();
require("dotenv").config();
const adminrouter = require("./routes/adminUserRoute");
const categoryRouter = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const productRoute = require("./routes/productRoute");
const bannerRoute = require("./routes/bannerRoute");
const videoRoute = require("./routes/videoRoute");
const feedbackRoute = require("./routes/feedbackRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const walletRoute = require("./routes/walletRoute");
const tableRoute = require("./routes/tableRoute");
const user = require("./routes/userRoute");
const tableBooking = require("./routes/tableBookingRoute");
const walletBalance = require("./routes/walletBalanceRoute");
const onlineOrder = require("./routes/onlineOrderRoute");
const dinningOrder = require("./routes/dinnningRoute");
const callForOrder = require("./routes/callForOrder");
const takeAway = require("./routes/takeAwayRoute");
const cartRoutes = require("./routes/cart.routes.js");
const deliveryRoutes = require("./routes/delivery.routes.js");
const notificationRoutes = require("./routes/notificationRoute.js");
const profileRoutes = require("./routes/profile.routes.js");
const scratchRoute = require("./routes/scratchRoute.js");
const deliverManUsers = require("./routes/deliveryManUserRoute.js");
const deliverManProfile = require("./routes/deliveryManProfile.route.js");
const deliverManOrder = require("./routes/deliveryManOrder.route.js");
const riderVehicelRoute = require("./routes/ridervehicleDetails.route.js");
const uploadRoute = require("./routes/upload.routes.js");
const deliveryManOrderStatusRoute = require("./routes/deliveryManOrderStatus.route.js");
const footerRoute = require("./routes/footer.route.js");
const socialMediaSettings = require("./routes/socialMediaSettings.js");
const restaurantStatusRoute = require("./routes/restaurantStatusRoute.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cron = require("./utils/cron.js");
const firebaseAccount = require("./firebase.json");
const constants = require("./utils/constants.js");
const admin = require("firebase-admin");
const router = express.Router();
const axios = require("axios");
const http = require("http").Server(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

const io = require("socket.io")(http, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/", adminrouter);
app.use("/", profileRoutes);
app.use("/", deliveryRoutes);
app.use("/", cartRoutes);
app.use("/", categoryRouter);
app.use("/", subCategoryRoute);
app.use("/", productRoute);
app.use("/", bannerRoute);
app.use("/", uploadRoute);
app.use("/", videoRoute);
app.use("/", feedbackRoute);
app.use("/", inventoryRoute);
app.use("/", user);
app.use("/", walletRoute);
app.use("/", tableRoute);
app.use("/", tableBooking);
app.use("/", walletBalance);
app.use("/", onlineOrder);
app.use("/", dinningOrder);
app.use("/", callForOrder);
app.use("/", takeAway);
app.use("/", notificationRoutes);
app.use("/", scratchRoute);
app.use("/", deliverManUsers);
app.use("/", deliverManProfile);
app.use("/", deliverManOrder);
app.use("/", riderVehicelRoute);
app.use("/", deliveryManOrderStatusRoute);
app.use("/", restaurantStatusRoute);
app.use("/", footerRoute);
app.use("/", socialMediaSettings);
app.use("/delivery-boy", require("./routes/delivery-boy.routes.js"));

// Socket.io connection handling
io.on("connection", (socket) => {
  socket.on("statusChange", async (data) => {
    socket.broadcast.emit("statusChanged", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Handle undefined routes
app.all("*", (req, res) => {
  return res.status(405).json({ message: "route not implemented" });
});

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err, "error");
  });

cron; // initializing cron

// admin.initializeApp({
//   credential: admin.credential.cert(firebaseAccount),
// });
constants.admin = admin;
