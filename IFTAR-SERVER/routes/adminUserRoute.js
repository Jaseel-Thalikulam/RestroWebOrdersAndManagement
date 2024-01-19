const express = require("express");
const router = express.Router();
const { getUser, createUser, getAllUser, updateUser, deleteUser, adminLogin } = require("../controllers/adminUserController");
const authenticateToken = require("../middleWare/AuthenticateUser");

router
  .post("/create", getUser).get("/getallusers",getAllUser)
  .post("/createadminuser", createUser)
  .get("/validateToken", authenticateToken, (req, res) => {
    res.status(200).send(req.user);
  }).put("/updateuser/:id",updateUser).delete("/deleteuser/:id",deleteUser)
  .post('/admins/login', adminLogin)
  

module.exports = router;