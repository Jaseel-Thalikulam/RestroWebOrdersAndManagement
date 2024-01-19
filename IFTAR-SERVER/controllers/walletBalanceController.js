const walletBalance=require("../modals/walletbalance")

const createWalletBalance=async(req,res)=>{
    
}
const getWalletBalance=async(req,res)=>{

}
const updateWalletBalance = async (req, res) => {
    const { walletbalance, amount } = req.body;
  
    try {
      const existingWalletBalance = await walletBalance.findOne({ walletbalance });
  
      if (existingWalletBalance) {
        existingWalletBalance.balance += amount;
        await walletBalance.findByIdAndUpdate(id, { ...req.body });
        res.status(200).json({ message: "Wallet balance updated successfully" });
      } else {
       
        await walletBalance.create({...req.body})
        res.status(200).json({ message: "Wallet balance created successfully" });
      }
    } catch (error) {
      console.error("Error updating wallet balance:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


module.exports={createWalletBalance,getWalletBalance,updateWalletBalance}