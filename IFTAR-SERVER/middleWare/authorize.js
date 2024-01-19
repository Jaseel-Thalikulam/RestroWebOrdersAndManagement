const jwt = require('jsonwebtoken')
const { model } = require('mongoose')
const DeliveryBoy = require('../modals/delivery-boy')
const Admin = require('../modals/adminUserModal')

async function authorizeDeliveryBoy(req, res, next) {
	const auth = req.headers.authorization
	if(!auth || !auth.startsWith('Bearer ')) {
		return res.status(401).json({message: 'Authorization failed'})
	}
	const token = auth.split(' ')[1]
	if (!token) {
		return res.status(401).json({message: 'Authorization failed'})
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY)
		const deliveryBoy = await DeliveryBoy.findOne({ username: decoded.username })
		req.deliveryBoy = deliveryBoy
		next()
	} catch (err) {
		return res.status(401).json({message: 'Authorization failed'})
	}
}

async function authorizeRestaurantAdmin(req, res, next) {
	const auth = req.headers.authorization
	if(!auth || !auth.startsWith('Bearer ')) {
		return res.status(401).json({message: 'Authorization failed'})
	}
	const token = auth.split(' ')[1]
	if (!token) {
		return res.status(401).json({message: 'Authorization failed'})
	}

	try {
		let {adminId} = jwt.verify(token, process.env.SECRET_KEY)
		const admin = await Admin.findById(adminId)
		if(!admin) {
			return res.status(401).json({message: 'Admin not found'});
		}
		req.admin = admin;
		next()
	} catch (err) {
		return res.status(401).json({message: 'Authorization failed'})
	}
}

const authorize = {
	authorizeDeliveryBoy,
	authorizeRestaurantAdmin
}

module.exports = authorize
