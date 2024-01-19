const express=require("express")
const router=express.Router()
const {createWallet,getWallet}=require("../controllers/walletController")


router.post("/createwallet",createWallet).get("/getWallet",getWallet)

module.exports=router