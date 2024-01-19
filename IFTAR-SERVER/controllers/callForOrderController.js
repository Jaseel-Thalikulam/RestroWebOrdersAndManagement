const callForOrder = require("../modals/callForOrder");
const _ = require("lodash");
const User = require("../modals/userModal");
const Order = require("../modals/order");
const productModal = require("../modals/productModal");

const createCallOrder = async (req, res) => {
  try {


    const orderedFoodArray = req.body.formData.orderedFood;

   const modifiedOrderedFood = orderedFoodArray.map(item => {
  if (item.type) {
    const [type, price] = item.type.split(' - ');
    return { ...item, type, price };
  } else {
    // If 'type' is not present, return the original object
    return item;
  }
});
    
    // Assigning the modified orderedFood array back to formData
    req.body.formData.orderedFood = modifiedOrderedFood;
    
    console.log(JSON.stringify(req.body));
    
    // get all without type food


    const foodWithoutType = req.body?.formData?.orderedFood.filter(
      (item) => !item.hasOwnProperty("type")
    );
    // get all with type food
    const foodWithType = req.body?.formData?.orderedFood.filter((item) =>
      item.hasOwnProperty("type")
    );
console.log(foodWithType,"foodWithType");
console.log(foodWithoutType,"foodWithoutType");
    // ================================================================================================

    const getData = await productModal.find({
      name: { $in: req.body?.formData?.orderedFood?.map((item) => item.food) },
    });

    const updatedOrderedFood = req.body?.formData?.orderedFood?.map((order) => {
      const productMatch = getData.find(
        (product) => product.name === order.food
      );

      return {
        ...order,
        image: productMatch ? productMatch.image : null,
      };
    });

    req.body.formData.orderedFood = updatedOrderedFood;
    // ================================================================================================

    // find all without type food from db
    const products = await productModal.find({
      name: { $in: foodWithoutType.map((item) => item.food) },
    });

    console.log(products,"products")
    // calculating each product total price
    const calculatedPrices = products.map((product) => {
      const requestItem = foodWithoutType.find(
        (item) => item.food === product.name
      );
console.log(requestItem,"reqqq");
      const quantity = parseInt(requestItem.quantity, 10);
      const totalPrice = quantity * (product.discountPrice ? product.discountPrice : +product.price);

      return { food: product.name, quantity: quantity, totalPrice: totalPrice };
    });
console.log(calculatedPrices,"calculatedPrices of all non type");
    // get grand total by product.
    const totalAmount = calculatedPrices.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    console.log(totalAmount, "totalAmount of  all non type");
    
    // ================================================================================================
    const userData = await User.findOne({
      phoneNumber: `+91${req.body.formData.mobileNumber}`,
    });

  const  { _id } = userData 
    
    const typesData = req.body.formData.types?.map((type) => ({
      type: type.type,
      price: type.price,
    }));
console.log(foodWithType,"foodwithtype");
    const foodItemCosts = foodWithType?.map(
      (item) => +item?.quantity * +item.price
    );
    console.log(foodItemCosts,"foodItemCosts");
    const totalFoodCost = foodItemCosts?.reduce((acc, cost) => acc + cost, 0);
    console.log(totalFoodCost,"totalFoodCost of typed food");

    if (totalAmount && totalFoodCost) {
      const grandTotal = Math.round(totalAmount + totalFoodCost);
      console.log(grandTotal,"grandtotal");
      const result = await Order.create({
        ...req.body.formData,
        orderType: "call",
        user: _id,
        BromagUserID:userData.userID?userData.userID:null,
        types: typesData,
        grandTotal: grandTotal,
      });
      // return res.status(200).send({ data: result });
    } else if (totalAmount) {
      const grandTotal = Math.round(totalAmount);
      const result = await Order.create({
        ...req.body.formData,
        orderType: "call",
        user: _id,
        BromagUserID:userData.userID?userData.userID:null,
        types: typesData,
        grandTotal: grandTotal,
      });
      // return res.status(200).send({ data: result });
    } else {
      const grandTotal = Math.round(totalFoodCost);
      const result = await Order.create({
        ...req.body.formData,
        orderType: "call",
        user: _id,
        BromagUserID:userData.userID?userData.userID:null,
        types: typesData,
        grandTotal: grandTotal,
      });
      console.log(result);
      // return res.status(200).send({ data: result });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("Something went wrong while creating call order");
  }
};

const getCallOrder = async (req, res) => {
  try {
    const result = await Order.find({ orderType: "call" }).sort({
      createdAt: -1,
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching call order");
  }
};

const updateCallOrder = async (req, res) => {
  const { id } = req.params;
  try {

console.log(req.body,"body");
    if (req.body?.types && req.body.types.length>0) {
      // get all without type food
      console.log("hyy");
      const foodWithoutType = req.body.orderedFood.filter(
        (item) => !item.hasOwnProperty("type")
      );

      // get all with type food
      const foodWithType = req.body?.orderedFood.filter((item) =>
        item.hasOwnProperty("type")
      );

      // find all without type food from db
      const products = await productModal.find({
        name: { $in: foodWithoutType.map((item) => item.food) },
      });

      // calculating each product total price
      const calculatedPrices = products.map((product) => {
        const requestItem = foodWithoutType.find(
          (item) => item.food === product.name
        );
        const quantity = parseInt(requestItem.quantity, 10);
        const totalPrice = quantity * product.price;
        return {
          food: product.name,
          quantity: quantity,
          totalPrice: totalPrice,
        };
      });

      // get grand total by product.
      const totalAmount = calculatedPrices.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      const { _id } = await User.findOne({
        phoneNumber: `+91${req.body.mobileNumber}`,
      });

      const typesData = req.body.types.map((type) => ({
        type: type.type,
        price: type.price,
      }));

      const foodItemCosts = foodWithType.map(
        (item) => item?.quantity * item.type
      );
      const totalFoodCost = foodItemCosts?.reduce((acc, cost) => acc + cost, 0);

      if (totalAmount && totalFoodCost) {
        const grandTotal = Math.round(totalAmount + totalFoodCost);
        const result = await Order.findByIdAndUpdate(
          { _id: id, orderType: "call" },
          {
            ...req.body,
            types: typesData,
            grandTotal: grandTotal,
          },
          { new: true }
        );
        return res.status(200).send({ data: result });
      } else if (totalAmount) {
        const grandTotal = Math.round(totalAmount);
        const result = await Order.findByIdAndUpdate(
          { _id: id, orderType: "call" },
          {
            ...req.body,
            types: typesData,
            grandTotal: grandTotal,
          },
          { new: true }
        );
        return res.status(200).send({ data: result });
      } else {
        const grandTotal = Math.round(totalFoodCost);
        const result = await Order.findByIdAndUpdate(
          { _id: id, orderType: "call" },
          {
            ...req.body,
            types: typesData,
            grandTotal: grandTotal,
          },
          { new: true }
        );
        return res.status(200).send({ data: result });
      }
    } else {
      delete req.body.types;
      const result = await Order.findByIdAndUpdate(
        { _id: id, orderType: "call" },
        { ...req.body },
        { new: true }
      );
      return res.status(200).send({ data: result });
    }
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while updating call order");
  }
};

const cancelMyCallOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_type } = req.body;

    if (order_type === "callfororder") {
      await callForOrder.findByIdAndUpdate(
        { _id: id },
        { status: "Cancelled" }
      );
    } else {
      await takeAwayModal.findByIdAndUpdate(
        { _id: id },
        { status: "Cancelled" }
      );
    }
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getMyCallForOrder = async (req, res) => {
  try {
    let user_contact = _.get(req, "body.userDetails.phoneNumber", "").slice(
      3,
      14
    );
    const result = await Order.find({
      mobileNumber: user_contact,
      orderType: "call",
    }).sort({ createdAt: -1 });

    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching call order");
  }
};

module.exports = {
  createCallOrder,
  getCallOrder,
  updateCallOrder,
  getMyCallForOrder,
  cancelMyCallOrder,
};
