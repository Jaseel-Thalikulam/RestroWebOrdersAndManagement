const Table = require("../modals/table");
const { get } = require("lodash");
const helpers = require("../utils/helpers");

const createTable = async (req, res) => {
  try {
    const tablePhto = req.file;

    if (tablePhto) {
      const path = `Table/${tablePhto.originalname}${Date.now()}/${
        tablePhto.filename
      }`;
      await helpers.uploadFile(tablePhto, path);
      if (path) {
        await helpers.deleteS3File(path);
      }
      const image = helpers.getS3FileUrl(path);
      helpers.deleteFile(tablePhto);
      await Table.create({
        seatsAvailable: req.body.seatsAvailable,
        tableNo: req.body.tableNo,
        image: image,
      });

      return res.status(200).send({ message: "Table created successfully" });
    }
  } catch (err) {
    console.log(err, "err");
    return res.status(500).send("Something went wrong while creating table");
  }
};

const getTable = async (req, res) => {
  try {
    const result = await Table.find({}).sort({ tableNo: 1 });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res.status(500).send("Something went wrong while fetching table");
  }
};

const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
  
    const imageUrl = req.body.image;
    if (get(req, "file", false)) {
      const tablePhto = req.file;

      if (tablePhto) {
        const path = `Table/${tablePhto.originalname}${Date.now()}/${
          tablePhto.filename
        }`;
        await helpers.uploadFile(tablePhto, path);
        if (imageUrl) {
          await helpers.deleteS3File(imageUrl);
        }
        const image = helpers.getS3FileUrl(path);
        helpers.deleteFile(tablePhto);
        await Table.findByIdAndUpdate(id,{
          seatsAvailable: req.body.seatsAvailable,
          tableNo: req.body.tableNo,
          image: image,
        });

        return res.status(200).send({ message: "Table updated successfully" });
      }
    } else {
      await Table.findByIdAndUpdate(id, {
        seatsAvailable: req.body.seatsAvailable,
        tableNo: req.body.tableNo,
        image: imageUrl,
      
      });
      return res.status(200).send({ Message: "Table updated successfully" });
    }
  } catch (err) {
    console.log(err,"err")
    return res.status(500).send("Something went wrong while updating table");
  }
};

const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    await Table.findByIdAndDelete(id);
    await helpers.deleteS3File(image);
    return res.status(200).send("table deleted");
  } catch (err) {
    return res.status(500).send("Something went wrong while deleting table");
  }
};

const getAllTables = async (req, res) => {
  try {
    const result = await Table.find({});
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send("Something went wrong while deleting table");
  }
};

module.exports = {
  createTable,
  deleteTable,
  getTable,
  updateTable,
  getAllTables,
};
