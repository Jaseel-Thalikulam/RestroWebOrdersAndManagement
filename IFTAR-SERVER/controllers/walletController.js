const wallet = require("../modals/walletModal");

const createWallet = async (req, res) => {
  try {
    const result = await wallet.create({ ...req.body });
    return res.status(200).send({data:result})
  } catch (err) {
    return res.status(404).send({ message: err });
  }
};


const getWallet=async(req,res)=>{
    try{
        const result=await wallet.find({})
        return res.status(200).send({data:result})
    }catch(err){
        return res.status(404).send({ message: err });
    }
}


module.exports={createWallet,getWallet}
