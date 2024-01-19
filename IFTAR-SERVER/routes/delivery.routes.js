const router = require("express").Router();

const {
    addDeliveryAddress,
    getDeliveryAddress,
    deleteDeliveryAddress,
} = require("../controllers/delivery.controller");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

// web routes
router.post("/add_delivery_address", webTokenMiddleware, addDeliveryAddress);
router.get("/get_delivery_address", webTokenMiddleware, getDeliveryAddress);
router.delete(
    "/delete_delivery_address/:id",
    webTokenMiddleware,
    deleteDeliveryAddress
);

module.exports = router;
