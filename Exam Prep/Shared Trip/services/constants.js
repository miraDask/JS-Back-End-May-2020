module.exports = {
	//PASSWORD
	UNMATCHING_PASSWORDS_MESSAGE: 'Passwords should match.',
	INCORRECT_PASSWORD_MESSAGE: 'Password should contains only english letters and digits.',
	INCORRECT_PASSWORD_LENGTH_MESSAGE: 'Password should be at least 8 characters long.',
	REQUIRED_PASSWORD: 'Password is required.',
	PASSWORD_MIN_LENGTH: 8,

	//EMAIL
	INCORRECT_EMAIL_MESSAGE: 'Invalid Email.',
	EMAIL_EXISTS_MESSAGE: 'User with this email is already registered',
	REQUIRED_EMAIL: 'Email is required.',
	EMAIL_PATTERN: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,

	//LOGIN
	INVALID_LOGIN_MESSAGE: 'Invalid email or password.',

	//DATE AND TIME
	REQUIRED_DATE_TIME: 'Date and time field is required',
	REQUIRED_DATE_TIME_MIN_LENGTH: 6,
	REQUIRED_DATE_TIME_MIN_LENGTH_MESSAGE: 'Date and time text is not in correct format',

	//POINTS
	REQUIRED_POINTS: 'Start and end points are required.',
	INCORRECT_POINT_MESSAGE: 'Start and end points are not in correct format',
	INCORRECT_POINT_LENGTH_MESSAGE: 'Name should be at least 5 characters long',
	POINTS_MIN_LENGTH: 4,

	//DESCRIPTION
	INCORRECT_DESCRIPTION_LENGTH_MESSAGE: 'Description should be at least 10 characters long',
	REQUIRED_DESCRIPTION: 'Description is required.',
	DESCRIPTION_MIN_LENGTH: 10,

	//IMAGE
	REQUIRED_IMAGE: 'Image link is required.',

	LETTERS_AND_DIGITS_PATTERN: /^[A-Za-z0-9]+$/,
	LETTERS_DIGITS_AND_WHITESPACE_PATTERN: /^[A-Za-z0-9\s]+$/,

	SALT_ROUNDS: 10
};
