const Tripp = require('../models/trippModel');
const usersService = require('../services/users');
const { REQUIRED_DATE_TIME_MIN_LENGTH_MESSAGE, INCORRECT_POINT_MESSAGE } = require('./constants');

const dateAndTimeMatch = /^[A-Za-z0-9 ]{6,} - [A-Za-z0-9: ]{6,}$/;
const pointsMatch = /^[A-Za-z0-9 ]{4,} - [A-Za-z0-9 ]{4,}$/;

module.exports = {
	create: async (trippObject) => {
		const { destination, dateTime, carImage, seats, description, creatorId } = trippObject;
		const errorMessages = [];

		if (!dateTime.match(dateAndTimeMatch)) {
			errorMessages.push(REQUIRED_DATE_TIME_MIN_LENGTH_MESSAGE);
		}

		if (!destination.match(pointsMatch)) {
			errorMessages.push(INCORRECT_POINT_MESSAGE);
		}

		if (errorMessages.length > 0) {
			return {
				success: false,
				errorMessages
			};
		}

		const splittedDestination = destination.split(' - ');
		const startPoint = splittedDestination[0];
		const endPoint = splittedDestination[1];
		const splittedDateTime = dateTime.split(' - ');
		const date = splittedDateTime[0];
		const time = splittedDateTime[1];

		const tripp = new Tripp({ startPoint, endPoint, date, time, creatorId, description, carImage, seats });
		try {
			const { _id } = await tripp.save();
			return {
				success: true,
				_id
			};
		} catch (error) {
			Object.keys(error.errors).forEach((x) => {
				errorMessages.push(error.errors[x].message);
			});

			return {
				success: false,
				errorMessages
			};
		}
	},

	edit: async (id, trippObject) => await Tripp.findByIdAndUpdate(id, trippObject),

	delete: async (id) => await Tripp.findByIdAndRemove(id),

	getById: async (id) => await Tripp.findById(id).lean(),

	getTrippWithBuddiesById: async (id, userId) => {
		const tripp = await Tripp.findById(id).populate('buddies').lean();
		const driver = await usersService.findEmailById(tripp.creatorId);

		return {
			_id: tripp._id,
			description: tripp.description,
			destination: `${tripp.startPoint} - ${tripp.endPoint}`,
			dateTime: `${tripp.date} at ${tripp.time}`,
			driverEmail: driver.email,
			isCreator: userId === tripp.creatorId.toString(),
			carImage: tripp.carImage,
			seats: tripp.seats,
			isJoined: tripp.buddies.some((x) => x._id.toString() === userId)
		};
	},

	getCreator: async (id) => {
		const { creatorId } = await Tripp.findById(id).select('creatorId');
		return creatorId;
	},

	getAll: async () => {
		const all = await Tripp.find().lean();
		const DTOS = all.map((x) => {
			return {
				_id: x._id,
				destination: `${x.startPoint} - ${x.endPoint}`,
				carImage: x.carImage
			};
		});

		return DTOS;
	},

	join: async (trippId, userId) => {
		await Tripp.findByIdAndUpdate(trippId, {
			$addToSet: {
				buddies: [ userId ]
			},
			$inc: {
				seats: -1
			}
		});
	}
};
