const inventory = require("../modals/inventoryModal");
const helpers = require("../utils/helpers");

const createInventory = async (req, res) => {
  try {
 

    const billPhoto = req.file;

    if (billPhoto) {
      const path = `InventoryBills/${billPhoto.originalname}${Date.now()}/${
        billPhoto.filename
      }`;
      await helpers.uploadFile(billPhoto, path);
      if (path) {
        await helpers.deleteS3File(path);
      }
      const image = helpers.getS3FileUrl(path);
      helpers.deleteFile(billPhoto);
      await inventory.create({
        productName: req.body.productName,
        category: req.body.category,
        image: image,
        provided: req.body.provided,
        consumed: req.body.consumed,
        available: req.body.available,
      });

      return res.status(200).send({ message: "Cusines created successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong while creating Cusines");
  }
};

const getInventory = async (req, res) => {
  try {
    const result = await inventory.find({});
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while fetching inventory");
  }
};
const updateInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const imageUrl=req.body.image
    const billPhoto = req.file;
    const data = await inventory.findOne({ _id: id });
   

    if (billPhoto) {
      const path = `InventoryBills/${billPhoto.originalname}${Date.now()}/${
        billPhoto.filename
      }`;
      await helpers.uploadFile(billPhoto, path);
      if (imageUrl) {
        await helpers.deleteS3File(imageUrl);
      }
      const image = helpers.getS3FileUrl(path);
      helpers.deleteFile(billPhoto);
      await inventory.findByIdAndUpdate(id, {
        productName: req.body.productName,
        category: req.body.category,
        image: image,
        provided: req.body.provided,
        consumed: req.body.consumed,
        available: req.body.available,
      });

      return res
        .status(200)
        .send({ message: "Inventory updated successfully" });
    } else {
      await inventory.findByIdAndUpdate(id, {
        productName: req.body.productName,
        category: req.body.category,
        image: data.image,
        provided: req.body.provided,
        consumed: req.body.consumed,
        available: req.body.available,
      });
    }
    return res
    .status(200)
    .send({ message: "Inventory updated successfully" });
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .send("Something went wrong while updating inventory");
  }
};
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    await inventory.findByIdAndDelete(id);
    await helpers.deleteS3File(image);

    return res.status(200).send("Category deleted");
  } catch (e) {
    console.log(e,"err")
    return res
      .status(500)
      .send("Something went wrong while deleting inventory");
  }
};

module.exports = {
  createInventory,
  getInventory,
  deleteInventory,
  updateInventory,
};
