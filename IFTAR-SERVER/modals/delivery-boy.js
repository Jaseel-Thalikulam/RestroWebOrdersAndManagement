const mongoose = require('mongoose')

const DeliveryBoySchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		restaurantName: String,
		restaurantLocation: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number], // [longitude, latitude]
			},
		},
		firstName: String,
		lastName: String,
		phone: String,
		email: String,
		fcmToken: String,
		pinCode: String,
		aadharFront: String,
		aadharBack: String,
		panFront: String,
		panBack: String,
		rcFront: String,
		rcBack: String,
		drivingLicenseFront: String,
		drivingLicenseBack: String,
		insuranceFront: String,
		insuranceBack: String,
		bikePhotoFront: String,
		bikePhotoBack: String,
		bikeOutwardVideo: String,
		aadharBack: String,
    photo: String,
    restaurantPhoto: String,
		currentCallOrder: {
			type: mongoose.Schema.ObjectId,
			ref: 'callOrder',
		},
		currentOnlineOrder: {
			type: mongoose.Schema.ObjectId,
			ref: 'onlineorder',
		},
		location: {
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number], // [longitude, latitude]
			},
		},
	},
	{ timestamps: true, versionKey: false }
)

DeliveryBoySchema.index({ location: '2dsphere' })

const DeliveryBoy = mongoose.model('DeliveryBoy', DeliveryBoySchema, 'delivery_boys')

module.exports = DeliveryBoy
