const router = require("express").Router();
const {
    addtocart,
    getCurrentUserCarts,
    getCurrentUserCartProducts,
    removeFromCart,
    incrementCartQuantity,
    handleDecrement,
    removeSoloFromCart,
} = require("../controllers/cart.controller.js");
const { webTokenMiddleware } = require("../middleWare/webMiddleware.js");

// web
router.post("/add_to_cart", webTokenMiddleware, addtocart);
router.get(
    "/get_current_user_carts/:id",
    webTokenMiddleware,
    getCurrentUserCarts
);
router.get(
    "/get_current_user_cart_products/:id",
    webTokenMiddleware,
    getCurrentUserCartProducts
);
router.delete("/remove_from_cart/:id", webTokenMiddleware, removeFromCart);
router.put(
    "/increment_cart_qty/:id",
    webTokenMiddleware,
    incrementCartQuantity
);
router.put("/decrement_cart_qty/:id", webTokenMiddleware, handleDecrement);
router.delete(
    "/remove_solo_from_cart/:id",
    webTokenMiddleware,
    removeSoloFromCart
);

module.exports = router;
