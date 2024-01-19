const jwt = require("jsonwebtoken");
const User = require("../modals/userModal");
const _ = require("lodash");

const webTokenMiddleware = async (req, res, next) => {
  try {
    let reachit = req.headers["aizasycoxsewxv2t64dxca-wl8n8qfq0gzux1as"];
    if (!reachit) {
      return res.status(500).send({ message: "Invalid token" });
    }
    const result = await jwt.verify(reachit, process.env.SECRET_KEY);
    
    if (!_.get(result, "phonenumber", false)) {
      return res.status(500).send({ message: "Invalid token" });
    }
    const tokenData = {
      _id: _.get(result, "id", false),
      phoneNumber: _.get(result, "phonenumber", false),
      user: _.get(result, "username", false),
    };
   
    req.body.userDetails = tokenData;
    next();
  } catch (err) {
    return res.status(500).send({ message: "Invalid token" });
  }
};

module.exports = { webTokenMiddleware };
