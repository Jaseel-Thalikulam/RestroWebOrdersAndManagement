const { get } = require("lodash");
const category = require("../modals/categoryModal");
const subCategory = require("../modals/subCategoryModal");
const Product = require("../modals/productModal");
const helpers = require("../utils/helpers");
const productModal = require("../modals/productModal");

const createCategory = async (req, res) => {
  try {
    let maximumCategory = 10;
    const { name } = req.body;
    const categoryCount = await category.countDocuments({});
    const existingCategory = await category.aggregate([
      {
        $match: {
          name: { $eq: name },
        },
      },
    ]);

    if (existingCategory.length > 0) {
      return res
        .status(400)
        .send(`Cuisine with the name '${name}' already exists .`);
    }

    if (categoryCount >= maximumCategory) {
      return res
        .status(400)
        .send(`Your Cuisines limit reached. Cannot create more Cusines.`);
    }

    const cuisinePhto = req.file;

    if (cuisinePhto) {
      const path = `Cuisines/${cuisinePhto.originalname}${Date.now()}/${
        cuisinePhto.filename
      }`;
      await helpers.uploadFile(cuisinePhto, path);
      if (path) {
        await helpers.deleteS3File(path);
      }
      const image = helpers.getS3FileUrl(path);
      helpers.deleteFile(cuisinePhto);
      await category.create({
        name: req.body.name,
        status: req.body.status,
        image: image,
      });

      return res.status(200).send({ message: "Cusines created successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong while creating Cusines");
  }
};

const getCategory = async (req, res) => {
  try {
    const result = await category.find({});
    return res.status(200).send({ data: result });
  } catch (e) {
    return res.status(500).send("Something went wrong while fetching Cusines");
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const imageUrl = req.body.image;
    if (get(req, "file", false)) {
      const cuisinePhto = req.file;
      if (cuisinePhto) {
        const path = `Cuisines/${cuisinePhto.originalname}${Date.now()}/${
          cuisinePhto.filename
        }`;
        await helpers.uploadFile(cuisinePhto, path);
        if (imageUrl) {
          await helpers.deleteS3File(imageUrl);
        }
        const image = helpers.getS3FileUrl(path);
        helpers.deleteFile(cuisinePhto);
        await category.findByIdAndUpdate(id, {
          name: req.body.name,
          status: req.body.status,
          image: image,
        });

        return res
          .status(200)
          .send({ message: "Cusines updated successfully" });
      }
    } else {
      console.log("false");
      await category.findByIdAndUpdate(id, {
        name: get(req, "body.name", ""),
        status: get(req, "body.status", ""),
        image: get(req, "body.image", ""),
      });
      return res.status(200).send({ Message: "Cusines updated successfully" });
    }
  } catch (e) {
    return res.status(500).send("Something went wrong while updating Cusines");
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    await category.findByIdAndDelete(id);
    await helpers.deleteS3File(image);
    return res.status(200).send("Category deleted");
  } catch (e) {
    return res.status(500).send("Something went wrong while deleting category");
  }
};

// web
const getAllCusines = async (req, res) => {
  try {
    let { search } = JSON.parse(req.params.id);
    let where = { status: true };

    if (search) {
      where.name = { $regex: search, $options: "i" };
    }
    console.log(JSON.parse(req.params.id), where);
    const result = await category.find(where);
    return res.status(200).send({ data: result });
  } catch (e) {
    return res.status(500).send("Something went wrong while deleting category");
  }
};

// search function
const getAllSearchCusinessData = async (req, res) => {
  try {
    let { id } = req.params;
    const searchPattern = new RegExp(id, "i");
    const result = await productModal.aggregate([
      {
        $match: {
          name: { $regex: searchPattern },
        },
      },
    ]);
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while searching products");
  }
};

const getAllCusinessFilter = async (req, res) => {
  try {
    const result = await category.find({ status: true });
    let target_id;
    if (req.params.id === "empty") {
      target_id = get(result, "[0]._id", "");
    } else {
      target_id = req.params.id;
    }
    const subcategory = await subCategory.find({
      categoryId: target_id,
      status: true,
    });
    let resultData = { categoryData: result, subCategoryData: subcategory };
    return res.status(200).send({ data: resultData });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong while deleting category");
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    const { cat, subCat, isNonVegOnly, isVegOnly } = JSON.parse(req.params.id);
console.log("isNonVegOnly", isNonVegOnly, "isVegOnly", isVegOnly);
let where = {};

if (cat && subCat) {
  where.categoryId = cat;
  where.subCategoryId = subCat;
} else if (cat) {
  where.categoryId = cat;
} else {
  return res.status(400).send("Both cat and subCat are required.");
}

// Apply filters based on isNonVegOnly and isVegOnly
if (isNonVegOnly && !isVegOnly) {
  where.isVeg = false;
} else if (isVegOnly && !isNonVegOnly) {
  where.isVeg = true;
}

where.status = { $in: [true, false] };

console.log(where);

try {
  const productData = await Product.find(where);
  console.log(productData);
  return res.status(200).send({ data: productData });
} catch (error) {
  return res.status(500).send({ error: "Internal Server Error" });
}

  } catch (e) {
    return res.status(500).send("Something went wrong while fetching products");
  }
};

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getAllCusines,
  getAllCusinessFilter,
  getFilteredProducts,
  getAllSearchCusinessData,
};
