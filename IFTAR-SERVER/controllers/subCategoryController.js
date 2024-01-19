const subCategory = require("../modals/subCategoryModal");
const { get } = require("lodash");
const helpers = require("../utils/helpers");

const createSubCategory = async (req, res) => {
  try {
    const maximumCount=10
    const {categoryName,categoryId}=req.body;
    const subCategoryCount=await subCategory.find({categoryId})
    if (subCategoryCount.length >= maximumCount) {
      return res.status(400).send(`Your ${categoryName} limit reached. Cannot create more ${categoryName}.`);
    }

    const subCuisinePhto = req.file;
    if (subCuisinePhto) {
      const path = `SubCuisines/${subCuisinePhto.originalname}${Date.now()}/${
        subCuisinePhto.filename
      }`;
      await helpers.uploadFile(subCuisinePhto, path);
      if (path) {
        await helpers.deleteS3File(path);
      }
      const image=helpers.getS3FileUrl(path)
      helpers.deleteFile(subCuisinePhto);
      await subCategory.create({
        name:get(req.body, 'name', ''),
        status:get(req.body, 'status', ''),
        categoryId:get(req.body, 'categoryId', ''),
        categoryName:get(req.body, 'categoryName', ''),
        image:image,
       
      });
      return res.status(200).send({message:"Subcuisine created successfully"});
     
    }
  } catch (err) {
    console.log(err,"err")
    return res
      .status(500)
      .send("Something went wrong while creating subcategory");
  }
};

const getSubCategory = async (req, res) => {
  try {
    const result = await subCategory.find({});
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while fetching subcategory");
  }
};



const updateSubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const imageUrl=req.body.image
    if (get(req, "file", false)) {
      const subCuisinePhto = req.file;
      if (subCuisinePhto) {
        const path = `SubCuisines/${subCuisinePhto.originalname}${Date.now()}/${
          subCuisinePhto.filename
        }`;
        await helpers.uploadFile(subCuisinePhto, path);
        if (imageUrl) {
          await helpers.deleteS3File(imageUrl);
        }
        const image = helpers.getS3FileUrl(path);
        helpers.deleteFile(subCuisinePhto);
        await subCategory.findByIdAndUpdate(id,{
          name:get(req.body, 'name', ''),
          status:get(req.body, 'status', ''),
          categoryId:get(req.body, 'categoryId', ''),
          categoryName:get(req.body, 'categoryName', ''),
          image:image,
        })  

        return res
          .status(200)
          .send({ message: "Cusines updated successfully" });
      }
    } else {
      await subCategory.findByIdAndUpdate(id, {
        name: get(req, "body.name", ""),
        status: get(req, "body.status", ""),
        categoryId: get(req.body, "categoryId", ""),
        categoryName:get(req.body, 'categoryName', ''),
        image: get(req, "body.image", ""),
      });
      return res.status(200).send({ Message: "subcuisine updated successfully" });
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send("Something went wrong while updating category");
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {image}=req.body
    await subCategory.findByIdAndDelete(id);
    await helpers.deleteS3File(image);
    return res.status(200).send("SubCategory deleted");
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while deleting subcategory");
  }
};

module.exports = {
  createSubCategory,
  deleteSubCategory,
  getSubCategory,
  updateSubCategory,
};
