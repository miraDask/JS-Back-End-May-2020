const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { String, Number, Boolean } = Schema.Types;

// MERCHANT
const MERCHANT_MIN_LENGTH = 4;
const INCORRECT_MERCHANT_LENGTH_MESSAGE = `Merchant should be at least ${MERCHANT_MIN_LENGTH} characters long`;
const REQUIRED_MERCHANT = 'Merchant is required.';

//DESCRIPTION
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 50;
const INCORRECT_DESCRIPTION_LENGTH_MESSAGE = `Description should be at least ${DESCRIPTION_MIN_LENGTH} and no longer than ${DESCRIPTION_MAX_LENGTH} characters long`;
const REQUIRED_DESCRIPTION = 'Description is required.';
const REQUIRED_DATE = 'Date is required.';
const REQUIRED_CATEGORY = 'Category is required.';

const categories = [
	'utilities',
	'travel',
	'taxes',
	'rent',
	'professional-services',
	'other',
	'office-supplies',
	'meals-and-entertainment',
	'materials',
	'maintenance',
	'labor',
	'interest',
	'insurance',
	'home-office',
	'fees',
	'equipment',
	'car',
	'benefits',
	'advertising'
];

const expenseSchema = new Schema({
	merchant: {
		type: String,
		required: [ true, REQUIRED_MERCHANT ],
		minlength: [ MERCHANT_MIN_LENGTH, INCORRECT_MERCHANT_LENGTH_MESSAGE ]
	},
	description: {
		type: String,
		required: [ true, REQUIRED_DESCRIPTION ],
		minlength: [ DESCRIPTION_MIN_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ],
		maxlength: [ DESCRIPTION_MAX_LENGTH, INCORRECT_DESCRIPTION_LENGTH_MESSAGE ]
	},
	total: {
		type: Number,
		required: true,
		min: 1
	},
	category: {
		type: String,
		required: [ true, REQUIRED_CATEGORY ],
		enum: categories
	},
	creatorId: {
		type: String,
		required: true
	},
	createdOn: {
		type: Date,
		required: [ true, REQUIRED_DATE ]
	},
	report: {
		type: Boolean,
		default: false,
		required: true
	}
});

module.exports = mongoose.model('Expense', expenseSchema);
