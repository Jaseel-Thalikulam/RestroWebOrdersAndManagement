const mongoose = require('mongoose')

const RiderNotificationSchema = mongoose.Schema(
	{
		rider: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'DeliveryBoy',
			required: true,
		},
		image: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		},
		callOrder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'callOrder',
		},
		onlineOrder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'onlineorder',
		},
		data: JSON,
	},
	{ timestamps: true, versionKey: false }
)

const RiderNotification = mongoose.model('RiderNotification', RiderNotificationSchema, 'rider_notifications')

module.exports = RiderNotification
