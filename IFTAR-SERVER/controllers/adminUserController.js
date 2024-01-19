const Admin = require("../modals/adminUserModal");
const jwt = require("jsonwebtoken");
const {get}=require("lodash");
const { validate } = require('super-easy-validator');

const getUser = async (req, res) => {
  try {
    const { name, password } = get(req,"body.values","");
    const user = await Admin.findOne({ name });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).send({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: get(user,"_id",""), name: get(user,"name") },
      process.env.SECRET_KEY,
      { expiresIn: "10000h" }
    );
    res.status(200).send({ message: token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createUser = async (req, res) => {
  try {
    const result=await Admin.create({ ...req.body });
    return res.status(200).send({ message: result });
  } catch (err) {
    console.log(err);
  }
};

const getAllUser = async (req, res) => {
  try {
    const result = await Admin.find({});
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while fetching admins");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    return res.status(200).send("Admin deleted");
  } catch (e) {
    console.log(e,"err")
    return res
      .status(500)
      .send("Something went wrong while deleting admin");
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send("Password is required for update");
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { password },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).send("Admin not found");
    }

    return res.status(200).json({ message: "Admin updated successfully", updatedAdmin });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Something went wrong while updating admin");
  }
};

const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    const rules = {
      email: 'email',
      password: 'string|min:3'
    }
    const {errors} = validate(rules, req.body);
    if(errors) {
      return res.status(400).json({message: errors[0]});
    }

    const admin = await Admin.findOne({email, password});
    if(!admin) {
      return res.status(401).json({message: 'authorization failed'})
    }
    admin.password = undefined;

    const token = jwt.sign({adminId: admin._id}, process.env.SECRET_KEY);
    return res.json({
      token,
      admin,
    });
  } catch (error) {
    console.error(err);
    return res.status(500).json({message: 'server error'});
  }
}

module.exports = { getUser, createUser, getAllUser,deleteUser,updateUser, adminLogin };