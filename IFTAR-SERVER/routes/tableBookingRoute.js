const express = require("express");
const router = express.Router();
const {
  createTableBooking,
  getTableBooking,
  updateTableBooking,
  bookMyTable,
  getAllBookedTables,
  cancelBooking,
  checkInBooking
} = require("../controllers/tableBookingController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");


router
  .post("/createbooking", createTableBooking)
  .get("/getbooking", getTableBooking)
  .put("/updatebooking/:id", updateTableBooking);

// web
router.post("/book_my_table", webTokenMiddleware, bookMyTable);
router.get("/get_all_booked_tables", webTokenMiddleware, getAllBookedTables);
router.put("/cancel_booking", cancelBooking);
router.put("/checkin_booking", checkInBooking);

module.exports = router;
