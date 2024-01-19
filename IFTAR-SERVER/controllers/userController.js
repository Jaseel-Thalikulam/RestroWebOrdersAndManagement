const User = require("../modals/userModal");
const onlineOrderModal = require("../modals/onlineOrderModal");
const takeAwayModal = require("../modals/takeAwayModal");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { default: axios } = require("axios");

const getUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      const createUser = await User.create({ ...req.body });
      const token = jwt.sign(
        {
          userId: createUser._id,
          name: createUser.user,
          email: createUser.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "10000h" }
      );
      res.status(200).send({ message: token });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.user, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "10000h" }
    );
    res.status(200).send({ message: token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: 'desc' });

    return res.status(200).send({ message: users });
  } catch (err) {
    console.log(err);
  }
};

async function generateRandomUserID() {
  const prefix = "BIPL1003";
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
  const userID = `${prefix}${randomNumber}`;

  // Check if the generated userID already exists in the model
  const existingUser = await User.findOne({ userID });

  // If userID exists, generate a new one recursively
  if (existingUser) {
    return generateRandomUserID();
  }

  return userID;
}

// web
const careteSignUp = async (req, res) => {
  try {
    
    console.log(req.body);
    const result = await User.find({ phoneNumber: req.body.phoneNumber });

    if (!_.isEmpty(result)) {
      return res
        .status(500)
        .send({ message: "This phone number has already been used." });
    }

    req.body.userID = await generateRandomUserID()

    const result2 = await User.create(req.body);
    return res.status(200).send({ data: result2 });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const xyxy = async (req, res) => {
  console.log(req.params);
  const { transactionId } = req.params;
  const apiKey = process.env.OTP_BSNL_API;
  const resObj = {};

  try {
    const response = await axios.get(
      `https://transapi.edumarcsms.com/api/v1/e/transaction/${transactionId}`,
      {
        headers: {
          Host: "transapi.edumarcsms.com",
          apikey: apiKey,
          "content-type": "application/json",
        },
      }
    )
console.log(response.data.data,"i am otpdata");
    if (response.data.success) {
      resObj.status = true;
      resObj.message = "user autherized successfully";
    } else {
      resObj.status = false;
      resObj.message = "user autherized failed";
    }

    res.status(200).json(resObj);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const sendOTPViaEdumarc = async (number) => {
   
   console.log(number);
   
   const url = "https://smsapi.edumarcsms.com/api/v1/sendsms";
   
  const headers = {
    apikey: "cleb7v3l30006crtn6x2zbb0l",
    "Content-Type": "application/json",
   };
   

  const OTP = `${Math.floor(100000 + Math.random() * 1000000)}`;

  const data = {
    number: [number],
    message: `OTP TO LOGIN YOUR BROMAG INDIA ACCOUNT IS ${OTP} .DON'T SHARE THIS OTP WITH ANYONE FOR SECURITY REASONS.`,
    senderId: "BROMAG",
    templateId: "1407170435158041375",
  };

  try {

    const response = await axios.post(url, data, { headers });
    if (response.data.success) {
      
      const currentTimestamp = Math.floor(Date.now() / 1000); 
      const Expiry = new Date((currentTimestamp + 60) * 1000); 


      return {OTP,Expiry}

     
    }

  } catch (error) {

    console.error("Error:", error.message);

  }
};

 const isExpired = (expiryTimestamp) => {
  // Convert the expiry timestamp to a Date object
  const expiryDate = new Date(expiryTimestamp);

  // Get the current time in seconds
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  // Compare the current time with the expiry time
  return currentTimeInSeconds > expiryDate.getTime() / 1000;
};


const verifyOTP = async (req, res) => {
  try {
    const {number,otp} = req.body

    const user = await User.findOne({ phoneNumber: number });

    if (user.otp) {
    
    
      if (user.otp.code === otp) {
     
        if (isExpired(user.otp.expiry)) {
         
          return res.status(200).send({success:false, message: "Expired OTP. Generate a fresh code" });
       
        } else {
          
        await  User.updateOne(
            { phoneNumber: number },
            { $unset: { otp: 1 } })

          return res.status(200).send({success:true, message: "Success! Your identity has been confirmed with the valid OTP. Welcome back!" });
       

        }
      } else {

        return res.status(200).send({ success: false, message: "Please Enter a Valid OTP" });
        
      }
    } else {
     
      return res.status(200).send({success:false, message: "To ensure secure login, kindly request and utilize the one-time password (OTP) " });
    
    }

  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

const sendOTP = async (req, res) => {
  try {

    const PhoneNumber = req.params.number
    const user = await User.findOne({ phoneNumber: PhoneNumber });

    if (!user) {
      console.log(user);
      return res.status(200).send({ success: false,message:"User Not Found" });
    } 

   const {OTP,Expiry} = await sendOTPViaEdumarc(PhoneNumber)


  user.otp.code = OTP;
  user.otp.expiry = Expiry;
    
    
  await user.save();
    
    
    return res.status(200).send({ success:true ,message :"Check for OTP on your registered number soon" });

    
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }

};

const makeUserToken = async (req, res) => {
  try {
    const result = await User.find({ phoneNumber: `${req.body.number}` });
    let tokenConstraints = {
      id: _.get(result, "[0]._id", ""),
      phonenumber: _.get(result, "[0].phoneNumber", ""),
      username: _.get(result, "[0].user", ""),
      email: _.get(result, "[0].email", ""),
    };
    const token = jwt.sign(tokenConstraints, process.env.SECRET_KEY, {});
    res.status(200).send({ data: token, message: "Start Your Journey" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const checkTokenStatus = async (req, res) => {
  try {
    const result = await User.find({
      _id: _.get(req, "body.userDetails._id", ""),
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const makeLogoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: _.get(req, "body.userDetails._id", "") },
      { tokenRef: "" }
    );
    return res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const updateMyPic = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: _.get(req, "body.userDetails._id", "") },
      { user_image: _.get(req, "body.user_image", "") }
    );
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const formData = {
      user: _.get(req, "body.user", ""),
      email: _.get(req, "body.email", ""),
      phoneNumber: _.get(req, "body.phoneNumber", ""),
      alter_mobile_number: _.get(req, "body.alter_mobile_number", ""),
    };
    await User.findByIdAndUpdate(
      { _id: _.get(req, "body.userDetails._id", "") },
      formData
    );
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_type } = req.body;
    if (order_type === "online") {
      await onlineOrderModal.findByIdAndUpdate(
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


module.exports = {
  getUser,
  getAllUsers,
  careteSignUp,
  sendOTP,
  makeUserToken,
  checkTokenStatus,
  makeLogoutUser,
  updateMyPic,
  updateProfile,
  cancelMyOrder,
  verifyOTP

};
