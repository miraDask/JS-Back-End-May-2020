const Expense = require('../models/expenseModel');

module.exports = {
	create: async (expenseObject) => {
		//expenseObject.date = Date.now();
		const expense = new Expense(expenseObject);
		try {
			const { _id } = await expense.save();
			return {
				success: true,
				_id
			};
		} catch (error) {
			const errorMessages = [];
			Object.keys(error.errors).forEach((x) => {
				errorMessages.push(error.errors[x].message);
			});

			return {
				success: false,
				errorMessages
			};
		}
	},

	edit: async (id, expenseObject) => await Expense.findByIdAndUpdate(id, expenseObject),

	delete: async (id) => await Expense.findByIdAndRemove(id),

	getById: async (id) => {
		const expense = await Expense.findById(id).lean();
		return {
			createdOn: expense.createdOn.toLocaleDateString('en-GB'),
			total: expense.total,
			merchant: expense.merchant,
			description: expense.description,
			_id: expense._id,
			category: expense.category
		};
	},

	getCreator: async (id) => {
		const { creatorId } = await Expense.findById(id).select('creatorId');
		return creatorId;
	},

	getAll: async (creatorId) => {
		const expenses = await Expense.find({ creatorId: creatorId }).lean();
		const {} = expenses;

		const dtos = expenses.map((x) => {
			return {
				_id: x._id.toString(),
				merchant: x.merchant,
				description: x.description,
				category: x.category,
				total: x.total,
				report: x.report,
				createdOn: x.createdOn.toLocaleDateString('en-GB')
			};
		});
		return dtos;
	}

	// attachAccessory: async (cubeId, accessoryId) => {
	// 	await Expense.findByIdAndUpdate(cubeId, {
	// 		$addToSet: {
	// 			accessories: [ accessoryId ]
	// 		}
	// 	});
	//}
};
