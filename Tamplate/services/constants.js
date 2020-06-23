module.exports = {
	//PASSWORD
	UNMATCHING_PASSWORDS_MESSAGE: 'Passwords should match.',
	INCORRECT_PASSWORD_MESSAGE: 'Password should contains only english letters and digits.',
	INCORRECT_PASSWORD_LENGTH_MESSAGE: 'Password should be at least 8 characters long.',
	REQUIRED_PASSWORD: 'Password is required.',
	PASSWORD_MIN_LENGTH: 8,

	//EMAIL
	INCORRECT_EMAIL_MESSAGE: 'Invalid Email.',
	REQUIRED_EMAIL: 'Email is required.',
	EMAIL_PATTERN: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,

	//USERNAME
	INCORRECT_USERNAME_LENGTH_MESSAGE: 'Username should be at least 5 characters long.',
	INCORRECT_USERNAME_MESSAGE: 'Username should contains only english letters and digits.',
	USERNAME_EXISTS_MESSAGE: 'User with that username already exists.',
	REQUIRED_USERNAME: 'Username is required.',

	//LOGIN
	INVALID_LOGIN_MESSAGE: 'Invalid username or password.',

	//NAME
	INCORRECT_NAME_MESSAGE: 'Name should contains only english letters, digits or white spaces.',
	INCORRECT_NAME_LENGTH_MESSAGE: 'Name should be at least 5 characters long',
	REQUIRED_NAME: 'Name is required.',
	NAME_MIN_LENGTH: 5,

	//DESCRIPTION
	INCORRECT_DESCRIPTION_LENGTH_MESSAGE: 'Description should be at least 20 characters long',
	INCORRECT_DESCRIPTION_MESSAGE: 'Description should contains only english letters, digits or white spaces.',
	REQUIRED_DESCRIPTION: 'Description is required.',
	DESCRIPTION_MIN_LENGTH: 20,

	//IMAGE
	REQUIRED_IMAGE: 'Image link is required.',

	LETTERS_AND_DIGITS_PATTERN: /^[A-Za-z0-9]+$/,
	LETTERS_DIGITS_AND_WHITESPACE_PATTERN: /^[A-Za-z0-9\s]+$/,

	SALT_ROUNDS: 10
};
