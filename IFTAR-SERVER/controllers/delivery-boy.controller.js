const jwt = require('jsonwebtoken')
const DeliveryBoy = require('../modals/delivery-boy')
const { validate } = require('super-easy-validator')
const helpers = require('../utils/helpers')
const CallOrder = require('../modals/callForOrder')
const OnlineOrder = require('../modals/onlineOrderModal')
const RiderNotification = require('../modals/rider-notification')
const OrderDelivery = require('../modals/order-delivery')

async function login(req, res) {
	try {
		const { username, password } = req.body

		const rules = {
			username: 'username',
			password: 'string|min:3',
		}
		const { errors } = validate(rules, req.body)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		const deliveryBoy = await DeliveryBoy.findOne({ username })
		if (!deliveryBoy) {
			return res.status(404).json({ message: 'Delivery boy with this username does not found' })
		}

		if (deliveryBoy.password !== password) {
			return res.status(401).json({ message: 'Authentication failed' })
		}
		deliveryBoy.password = undefined

		const token = jwt.sign({ username }, process.env.SECRET_KEY)
		return res.json({ token, deliveryBoy })
	} catch (error) {
		console.error(error)
	}
}

async function createDeliveryBoy(req, res) {
	try {
		const { username, password, restaurantName, restaurantLocation } = req.body

		const rules = {
			username: 'username',
			password: 'string|min:3',
			restaurantName: 'string|min:3',
			restaurantLocation: 'array|size:2|arrayof:number',
		}
		const { errors } = validate(rules, req.body)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		const db = await DeliveryBoy.findOne({ username })
		if (db) {
			return res.status(409).json({ message: 'Delivery boy already exist' })
		}

		const deliveryBoy = await DeliveryBoy.create({
			username,
			password,
			restaurantName,
			restaurantLocation: {
				type: 'Point',
				coordinates: restaurantLocation,
			},
		})
		deliveryBoy.password = undefined

		return res.json({ deliveryBoy })
	} catch (error) {
		console.error(error)
	}
}

async function uploadRestaurantPhoto(req, res) {
	try {
		const deliveryBoyId = req.params.id

		const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId)
		if (!deliveryBoy) {
			return res.status(404).json({ message: 'Delivery boy not found' })
		}

		const restaurantPhoto = req.files?.restaurantPhoto?.[0]
		if (!restaurantPhoto) {
			return res.status(400).json({ message: 'Restaurant photo is required' })
		}

		const path = `delivery-boy/${deliveryBoy._id}/${restaurantPhoto.filename}`
		await helpers.uploadFile(restaurantPhoto, path)
		if (deliveryBoy.restaurantPhoto) {
			await helpers.deleteS3File(deliveryBoy.restaurantPhoto)
		}
		helpers.deleteFile(restaurantPhoto)
		deliveryBoy.restaurantPhoto = helpers.getS3FileUrl(path)
		await deliveryBoy.save()

		return res.json({ message: 'Restaurant photo uploaded successfully' })
	} catch (error) {
		console.error(error)
	}
}

async function getProfile(req, res) {
	try {
		const deliveryBoy = req.deliveryBoy
		deliveryBoy.password = undefined
		return res.json({ deliveryBoy })
	} catch (error) {
		console.error(error)
	}
}

async function patchProfile(req, res) {
	try {
		const { password, firstName, lastName, phone, email, pinCode, coordinates, currentCallOrder, currentOnlineOrder, fcmToken } =
			req.body
		const deliveryBoy = req.deliveryBoy

		const rules = {
			password: 'optional|string|min:3',
			firstName: 'optional|name',
			lastName: 'optional|name',
			phone: 'optional|regex:/^[0-9]{10}$/',
			email: 'optional|email',
			pinCode: 'optional|string|natural|size:6',
			coordinates: 'optional|array|size:2|arrayof:number',
			currentCallOrder: 'optional|nullable|mongoid',
			currentOnlineOrder: 'optional|nullable|mongoid',
			fcmToken: 'optional|regex:/^[a-zA-Z0-9_-]{140,255}$/'
		}
		const { errors } = validate(rules, req.body)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		deliveryBoy.password = password ?? deliveryBoy.password
		deliveryBoy.fcmToken = fcmToken ?? deliveryBoy.fcmToken
		deliveryBoy.firstName = firstName ?? deliveryBoy.firstName
		deliveryBoy.lastName = lastName ?? deliveryBoy.lastName
		deliveryBoy.phone = phone ?? deliveryBoy.phone
		deliveryBoy.email = email ?? deliveryBoy.email
		deliveryBoy.pinCode = pinCode ?? deliveryBoy.pinCode
		if (coordinates) {
			deliveryBoy.location = { type: 'Point', coordinates }
		}
		if (currentCallOrder !== undefined) {
			deliveryBoy.currentCallOrder = currentCallOrder ?? undefined
		}
		if (currentOnlineOrder !== undefined) {
			deliveryBoy.currentOnlineOrder = currentOnlineOrder ?? undefined
		}
		await deliveryBoy.save()

		deliveryBoy.password = undefined;

		return res.json({ message: 'Details updated successfully', deliveryBoy })
	} catch (error) {
		console.error(error)
	}
}

async function putProfileDocuments(req, res) {
	try {
		const deliveryBoy = req.deliveryBoy

		const aadharFront = req.files?.aadharFront?.[0]
		const aadharBack = req.files?.aadharBack?.[0]
		const panFront = req.files?.panFront?.[0]
		const panBack = req.files?.panBack?.[0]
		const rcFront = req.files?.rcFront?.[0]
		const rcBack = req.files?.rcBack?.[0]
		const drivingLicenseFront = req.files?.drivingLicenseFront?.[0]
		const drivingLicenseBack = req.files?.drivingLicenseBack?.[0]
		const insuranceFront = req.files?.insuranceFront?.[0]
		const insuranceBack = req.files?.insuranceBack?.[0]
		const bikePhotoFront = req.files?.bikePhotoFront?.[0]
		const bikePhotoBack = req.files?.bikePhotoBack?.[0]
		const photo = req.files?.photo?.[0]

		if (aadharFront) {
			const path = `delivery-boy/${deliveryBoy._id}/${aadharFront.filename}`
			await helpers.uploadFile(aadharFront, path)
			if (deliveryBoy.aadharFront) {
				await helpers.deleteS3File(deliveryBoy.aadharFront)
			}
			deliveryBoy.aadharFront = helpers.getS3FileUrl(path)
			helpers.deleteFile(aadharFront)
		}

		if (aadharBack) {
			const path = `delivery-boy/${deliveryBoy._id}/${aadharBack.filename}`
			await helpers.uploadFile(aadharBack, path)
			if (deliveryBoy.aadharBack) {
				await helpers.deleteS3File(deliveryBoy.aadharBack)
			}
			deliveryBoy.aadharBack = helpers.getS3FileUrl(path)
			helpers.deleteFile(aadharBack)
		}

		if (panFront) {
			const path = `delivery-boy/${deliveryBoy._id}/${panFront.filename}`
			await helpers.uploadFile(panFront, path)
			if (deliveryBoy.panFront) {
				await helpers.deleteS3File(deliveryBoy.panFront)
			}
			deliveryBoy.panFront = helpers.getS3FileUrl(path)
			helpers.deleteFile(panFront)
		}

		if (panBack) {
			const path = `delivery-boy/${deliveryBoy._id}/${panBack.filename}`
			await helpers.uploadFile(panBack, path)
			if (deliveryBoy.panBack) {
				await helpers.deleteS3File(deliveryBoy.panBack)
			}
			deliveryBoy.panBack = helpers.getS3FileUrl(path)
			helpers.deleteFile(panBack)
		}

		if (rcFront) {
			const path = `delivery-boy/${deliveryBoy._id}/${rcFront.filename}`
			await helpers.uploadFile(rcFront, path)
			if (deliveryBoy.rcFront) {
				await helpers.deleteS3File(deliveryBoy.rcFront)
			}
			deliveryBoy.rcFront = helpers.getS3FileUrl(path)
			helpers.deleteFile(rcFront)
		}

		if (rcBack) {
			const path = `delivery-boy/${deliveryBoy._id}/${rcBack.filename}`
			await helpers.uploadFile(rcBack, path)
			if (deliveryBoy.rcBack) {
				await helpers.deleteS3File(deliveryBoy.rcBack)
			}
			deliveryBoy.rcBack = helpers.getS3FileUrl(path)
			helpers.deleteFile(rcBack)
		}

		if (drivingLicenseFront) {
			const path = `delivery-boy/${deliveryBoy._id}/${drivingLicenseFront.filename}`
			await helpers.uploadFile(drivingLicenseFront, path)
			if (deliveryBoy.drivingLicenseFront) {
				await helpers.deleteS3File(deliveryBoy.drivingLicenseFront)
			}
			deliveryBoy.drivingLicenseFront = helpers.getS3FileUrl(path)
			helpers.deleteFile(drivingLicenseFront)
		}

		if (drivingLicenseBack) {
			const path = `delivery-boy/${deliveryBoy._id}/${drivingLicenseBack.filename}`
			await helpers.uploadFile(drivingLicenseBack, path)
			if (deliveryBoy.drivingLicenseBack) {
				await helpers.deleteS3File(deliveryBoy.drivingLicenseBack)
			}
			deliveryBoy.drivingLicenseBack = helpers.getS3FileUrl(path)
			helpers.deleteFile(drivingLicenseBack)
		}

		if (insuranceFront) {
			const path = `delivery-boy/${deliveryBoy._id}/${insuranceFront.filename}`
			await helpers.uploadFile(insuranceFront, path)
			if (deliveryBoy.insuranceFront) {
				await helpers.deleteS3File(deliveryBoy.insuranceFront)
			}
			deliveryBoy.insuranceFront = helpers.getS3FileUrl(path)
			helpers.deleteFile(insuranceFront)
		}

		if (insuranceBack) {
			const path = `delivery-boy/${deliveryBoy._id}/${insuranceBack.filename}`
			await helpers.uploadFile(insuranceBack, path)
			if (deliveryBoy.insuranceBack) {
				await helpers.deleteS3File(deliveryBoy.insuranceBack)
			}
			deliveryBoy.insuranceBack = helpers.getS3FileUrl(path)
			helpers.deleteFile(insuranceBack)
		}

		if (photo) {
			const path = `delivery-boy/${deliveryBoy._id}/${photo.filename}`
			await helpers.uploadFile(photo, path)
			if (deliveryBoy.photo) {
				await helpers.deleteS3File(deliveryBoy.photo)
			}
			deliveryBoy.photo = helpers.getS3FileUrl(path)
			helpers.deleteFile(photo)
		}

		if (bikePhotoFront) {
			const path = `delivery-boy/${deliveryBoy._id}/${bikePhotoFront.filename}`
			await helpers.uploadFile(bikePhotoFront, path)
			if (deliveryBoy.bikePhotoFront) {
				await helpers.deleteS3File(deliveryBoy.bikePhotoFront)
			}
			deliveryBoy.bikePhotoFront = helpers.getS3FileUrl(path)
			helpers.deleteFile(bikePhotoFront)
		}

		if (bikePhotoBack) {
			const path = `delivery-boy/${deliveryBoy._id}/${bikePhotoBack.filename}`
			await helpers.uploadFile(bikePhotoBack, path)
			if (deliveryBoy.bikePhotoBack) {
				await helpers.deleteS3File(deliveryBoy.bikePhotoBack)
			}
			deliveryBoy.bikePhotoBack = helpers.getS3FileUrl(path)
			helpers.deleteFile(bikePhotoBack)
		}

		await deliveryBoy.save()

		deliveryBoy.password = undefined

		return res.json({ message: 'Details updated successfully', deliveryBoy })
	} catch (error) {
		console.error(error)
	}
}

async function putBikeVideos(req, res) {
	try {
		const deliveryBoy = req.deliveryBoy

		const bikeInwardVideo = req.files?.bikeInwardVideo?.[0]
		const bikeOutwardVideo = req.files?.bikeOutwardVideo?.[0]

		if (bikeInwardVideo) {
			const path = `delivery-boy/${deliveryBoy._id}/${bikeInwardVideo.filename}`
			await helpers.uploadFile(bikeInwardVideo, path)
			if (deliveryBoy.bikeInwardVideo) {
				await helpers.deleteS3File(deliveryBoy.bikeInwardVideo)
			}
			deliveryBoy.bikeInwardVideo = helpers.getS3FileUrl(path)
			helpers.deleteFile(bikeInwardVideo)
		}

		if (bikeOutwardVideo) {
			const path = `delivery-boy/${deliveryBoy._id}/${bikeOutwardVideo.filename}`
			await helpers.uploadFile(bikeOutwardVideo, path)
			if (deliveryBoy.bikeOutwardVideo) {
				await helpers.deleteS3File(deliveryBoy.bikeOutwardVideo)
			}
			deliveryBoy.bikeOutwardVideo = helpers.getS3FileUrl(path)
			helpers.deleteFile(bikeOutwardVideo)
		}

		await deliveryBoy.save()

		deliveryBoy.password = undefined;

		return res.json({ message: 'Details updated successfully', deliveryBoy })
	} catch (error) {
		console.error(error)
	}
}

async function getOrders(req, res) {
	try {
		const { createdAtMin, createdAtMax } = req.query
		const deliveryBoy = req.deliveryBoy

		const query = {}
		if (createdAtMin || createdAtMax) {
			query.createdAt = {}
		}
		if (createdAtMin) {
			query.createdAt.$gte = new Date(createdAtMin)
		}
		if (createdAtMax) {
			query.createdAt.$lte = new Date(createdAtMax)
		}
		const callOrders = await CallOrder.find({ deliveryStatus: 'delivery', ...query })
		const onlineOrders = await OnlineOrder.find(query)
		return res.json({ callOrders, onlineOrders })
	} catch (error) {
		console.error(error)
	}
}

async function getNotifications(req, res) {
	try {
		const rider = req.deliveryBoy
		const notifications = await RiderNotification.find({ rider: rider._id }).sort({ createdAt: -1 })
		return res.json({ notifications })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

async function getOrderDeliveries(req, res) {
	try {
		const deliveryBoy = req.deliveryBoy

		const deliveries = await OrderDelivery.find({
			rider: deliveryBoy._id,
		})

		return res.json({ deliveries })
	} catch (error) {
		console.error(error)
	}
}

async function postOrderDelivery(req, res) {
	try {
		const { onlineOrder, callOrder, startLocation } = req.body
		const deliveryBoy = req.deliveryBoy

		const rules = {
			onlineOrder: 'optional|mongoid',
			callOrder: 'optional|mongoid',
			$atleast: 'onlineOrder|callOrder',
			startLocation: 'optional|array|size:2|arrayof:number',
		}
		const { errors } = validate(rules, req.body)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		if (onlineOrder) {
			let _delivery = await OrderDelivery.findOne({
				onlineOrder,
				cancelledAt: { $exists: false },
			})
			if (_delivery) {
				return res.status(403).json({ message: 'A delivery of this online order is already picked' })
			}
		}

		if (callOrder) {
			let _delivery = await OrderDelivery.findOne({
				callOrder,
				cancelledAt: { $exists: false },
			})
			if (_delivery) {
				return res.status(403).json({ message: 'A delivery of this call order is already picked' })
			}
		}

		const delivery = await OrderDelivery.create({
			rider: deliveryBoy._id,
			onlineOrder,
			callOrder,
			startedAt: new Date(),
			startLocation: {
				type: 'Point',
				coordinates: startLocation,
			},
		})

		return res.status(201).json({ delivery })
	} catch (error) {
		console.error(error)
	}
}

async function patchOrderDelivery(req, res) {
	try {
		const { cancelled, cancellationReason, reachedRestaurant, leftRestaurant, delivered, deliveredLocation } = req.body
		const deliveryBoy = req.deliveryBoy
		const deliveryId = req.params.id

		const rules = {
			cancelled: 'optional|boolean',
			cancellationReason: 'optional|string|min:10',
			reachedRestaurant: 'optional|boolean',
			leftRestaurant: 'optional|boolean',
			delivered: 'optional|boolean',
			deliveredLocation: 'optional|array|size:2|arrayof:number',
		}
		const { errors } = validate(rules, req.body)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		const delivery = await OrderDelivery.findOne({
			_id: deliveryId,
			rider: deliveryBoy._id,
		})
		if (!delivery) {
			return res.status(404).json({ message: 'Order delivery not found' })
		}

		if(delivery.cancelledAt) {
			return res.status(403).json({message: 'Order delivery has already been cancelled'})
		}

		if(delivery.deliveredAt) {
			return res.status(403).json({message: 'Order has already been delivered'})
		}

		if(cancelled) {
			if(!cancellationReason) {
				return res.status(400).json({message: 'Cancellation reason is required'})
			}
			delivery.cancelledAt = new Date();
			delivery.cancellationReason = cancellationReason;
		}

		if(reachedRestaurant) {
			if(delivery.leftRestaurantAt) {
				return res.status(403).json({message: 'Already left restaurant'})
			}
			delivery.reachedRestaurantAt = new Date();
		}

		if(leftRestaurant) {
			if(!delivery.reachedRestaurantAt) {
				return res.status(403).json({message: 'Cant leave without reaching restaurant first'})
			}
			delivery.leftRestaurantAt = new Date();
		}

		if(delivered) {
			if(!delivery.leftRestaurantAt) {
				return res.status(403).json({message: 'Cant delivered without leaving restaurant first'})
			}
			if(!deliveredLocation) {
				return res.status(400).json({message: 'Delivered Location is required'})
			}
			delivery.deliveredAt = new Date();
			delivery.deliveredLocation = {
				type: 'Point',
				coordinates: deliveredLocation
			}
		}
		await delivery.save();

		return res.json({ message: 'Order delivery updated successfully' })
	} catch (error) {
		console.error(error)
	}
}

const DeliveryBoyControllers = {
	createDeliveryBoy,
	uploadRestaurantPhoto,
	login,
	getProfile,
	patchProfile,
	putProfileDocuments,
	putBikeVideos,
	getOrders,
	getNotifications,
	getOrderDeliveries,
	postOrderDelivery,
	patchOrderDelivery,
}

module.exports = DeliveryBoyControllers
