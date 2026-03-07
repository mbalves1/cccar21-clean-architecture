import axios from 'axios';
axios.defaults.validateStatus = () => true;

test('Deve criar uma conta', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const responseSignup = await axios.post(
		'http://localhost:3000/signup',
		input,
	);
	const outputSignup = responseSignup.data;

	expect(outputSignup.accountId).toBeDefined();
	const responseGetAccount = await axios.get(
		`http://localhost:3000/accounts/${outputSignup.accountId}`,
	);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
});

test('Não deve criar uma conta se nome for inválido', async () => {
	const input = {
		name: 'John',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const responseSignup = await axios.post(
		'http://localhost:3000/signup',
		input,
	);
	expect(responseSignup.status).toBe(422);
	const outputSignup = responseSignup.data;
	expect(outputSignup.message).toBe('Invalid name');
});
