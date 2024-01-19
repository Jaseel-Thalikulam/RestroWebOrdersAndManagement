const _ = require("lodash");
const Cart = require("../modals/cart.models.js");
const Product = require("../modals/productModal.js");


async function getTypeData(productId, typeId) {
  try {
    const product = await Product.findOne({
      _id: productId,
      "types._id": typeId,
    });

    if (product) {
      // Extract the type data from the product
      const typeData = product.types.find((type) => type._id.toString() === typeId);
console.log(typeData,"heyey");
      return typeData;
    } else {
      console.log("Product not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching type data:", error);
    throw error;
  }
}

const addtocart = async (req, res) => {
  try {
    let typeRef= {}
     if (req.body.typeRef) {
       typeRef = await getTypeData(req.body.productRef,req.body.typeRef) 
      console.log(typeRef,"i amaamaaasdsdef");
    }
    
    let formData
    if (typeRef) {
      
      
    formData = {
        userRef: _.get(req, "body.userDetails._id", ""),
        typeRef,
        productRef: _.get(req, "body.productRef", ""),
        orderRef: _.get(req, "body.orderRef", ""),
        bookingRef: _.get(req, "body.bookingRef", ""),
      };
    } else {
 formData = {
        userRef: _.get(req, "body.userDetails._id", ""),
        productRef: _.get(req, "body.productRef", ""),
        orderRef: _.get(req, "body.orderRef", ""),
        bookingRef: _.get(req, "body.bookingRef", ""),
      };
    }

console.log(formData,"i am formdata");

    const data = await Cart.create(formData);

    // console.log(data);

    return res
      .status(200)
      .send({ message: " Food successfully added to the cart" });


  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getCurrentUserCarts = async (req, res) => {
  try {
    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      orderRef: _.get(req, "params.id", ""),
    };
    const result = await Cart.find(where, { userRef: 0, orderRef: 0 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getCurrentUserCartProducts = async (req, res) => {
  try {
    console.log("called");
    const { order_ref, bookingref } = JSON.parse(req.params.id);

    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      orderRef: order_ref,
    };

    if (bookingref) {
      where.bookingRef = bookingref;
    }


    let collect_current_user_carts = await Cart.find(where, {
      userRef: 0,
      orderRef: 0,
    }).populate("productRef")
   
  

    // let foundType
  //   const processUserCarts = async () => {
  //     // Assuming collect_current_user_carts is an array of items
  //     for (const data of collect_current_user_carts) {
  //       try {
  //         let product = await Product.findById(data.productRef._id);
    
    
  //         if (!product) {
  //           return;
  //         }
    
  //         if (product.types && Array.isArray(product.types)) {
  //            foundType = product.types.find(type => type._id.toString() === data.typeRef);
    
  //           if (foundType) {
  //             console.log(`foundType`, foundType);
  //             data.typeRef = foundType
  //             // data.typeRef = JSON.parse(data.typeRef);
              
  //             console.log(typeof foundType);
             
  //           } else {
  //             console.log('Type not found');
  //           }
  //         } else {
  //           console.log('Product does not have a valid types array');
  //         }
  //       } catch (error) {
  //         console.error('Error processing user cart:', error);
  //       }
  //     }
      

  //   };
    
  //   // Call the asynchronous function
  //  await processUserCarts();
   
    
    console.log(collect_current_user_carts);

//     collect_current_user_carts.map((data) => {


//       const product = await Product.findById(data.productRef._id)
//       console.log(product);
//       if (!product) {
     
//         return;
//       }

//       if (product.types && Array.isArray(product.types)) {
//         // Find the type within the types array by _id
//         const foundType = product.types.find(type => type._id.toString() === collect_current_user_carts.typeRef);
  
//         if (foundType) {
//           // You have found the type, and it's stored in the 'foundType' variable
//           console.log(foundType);
//         } else {
//           console.log('Type not found');
//         }
//       } else {
//         console.log('Product does not have a valid types array');
//       }

// })
    


    // console.log(collect_current_user_carts,"collectss");

    return res.status(200).send({ data: collect_current_user_carts });

  } catch (err) {

    console.log(err);

    return res.status(500).send({ message: "Something went wrong" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { orderRef, ptoductRef, bookingRef } = JSON.parse(req.params.id);
    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      productRef: ptoductRef,
      orderRef: orderRef,
    };

    if (bookingRef) {
      where.bookingRef = bookingRef;
    }

    await Cart.deleteOne(where);
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const incrementCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Cart.findByIdAndUpdate(
      { _id: id },
      { $inc: { quantity: 1 } }
    );
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const handleDecrement = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndUpdate({ _id: id }, { $inc: { quantity: -1 } });
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const removeSoloFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete({ _id: id });
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  addtocart,
  getCurrentUserCarts,
  getCurrentUserCartProducts,
  removeFromCart,
  incrementCartQuantity,
  handleDecrement,
  removeSoloFromCart,
};
