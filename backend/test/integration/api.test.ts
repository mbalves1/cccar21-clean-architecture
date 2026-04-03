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

test('Deve criar uma ordem de compra', async () => {
	const marketId = `BTC/USD/${Math.random()}`;
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
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 100000,
	};
	await axios.post('http://localhost:3000/deposit', inputDeposit);

	const inputPlaceOrder = {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	};
	const responsePlaceOrder = await axios.post(
		'http://localhost:3000/place_order',
		inputPlaceOrder,
	);
	const outputPlaceOrder = responsePlaceOrder.data;
	expect(outputPlaceOrder.orderId).toBeDefined();
	const responseGetOrder = await axios.get(
		`http://localhost:3000/orders/${outputPlaceOrder.orderId}`,
	);
	const outputGetOrder = responseGetOrder.data;
	expect(outputGetOrder.marketId).toBe(inputPlaceOrder.marketId);
	expect(outputGetOrder.side).toBe(inputPlaceOrder.side);
	expect(outputGetOrder.quantity).toBe(inputPlaceOrder.quantity);
	expect(outputGetOrder.price).toBe(inputPlaceOrder.price);
	const responseGetDepth = await axios.get(
		`http://localhost:3000/markets/${encodeURIComponent(marketId)}/depth`,
	);
	const outputGetDepth = responseGetDepth.data;
	expect(outputGetDepth.buys).toHaveLength(1);
	expect(outputGetDepth.sells).toHaveLength(0);
	expect(outputGetDepth.buys[0].quantity).toBe(1);
	expect(outputGetDepth.buys[0].price).toBe(85000);
});

test('Deve criar varias ordens de compra e verificar o depth', async () => {
	const marketId = `BTC/USD/${Math.random()}`;
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
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 10000000,
	};
	await axios.post('http://localhost:3000/deposit', inputDeposit);
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	});
	const responseGetDepth = await axios.get(
		`http://localhost:3000/markets/${encodeURIComponent(marketId)}/depth`,
	);
	const outputGetDepth = responseGetDepth.data;
	expect(outputGetDepth.buys).toHaveLength(1);
	expect(outputGetDepth.sells).toHaveLength(0);
	expect(outputGetDepth.buys[0].quantity).toBe(2);
	expect(outputGetDepth.buys[0].price).toBe(85000);
});

test('Deve criar varias ordens de compra com precos diff e verificar o depth', async () => {
	const marketId = `BTC/USD/${Math.random()}`;
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
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 10000000,
	};
	await axios.post('http://localhost:3000/deposit', inputDeposit);
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 84000,
	});
	const responseGetDepth = await axios.get(
		`http://localhost:3000/markets/${encodeURIComponent(marketId)}/depth`,
	);
	const outputGetDepth = responseGetDepth.data;
	expect(outputGetDepth.buys).toHaveLength(2);
	expect(outputGetDepth.sells).toHaveLength(0);
	expect(outputGetDepth.buys[0].quantity).toBe(1);
	expect(outputGetDepth.buys[0].price).toBe(84000);
	expect(outputGetDepth.buys[1].quantity).toBe(2);
	expect(outputGetDepth.buys[1].price).toBe(85000);
});

test('Deve criar uma ordem de compra e outra de venda no mesmo valor', async () => {
	const marketId = `BTC/USD/${Math.random()}`;
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
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 10000000,
	};
	await axios.post('http://localhost:3000/deposit', inputDeposit);
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'sell',
		quantity: 1,
		price: 85000,
	});
	const responseGetDepth = await axios.get(
		`http://localhost:3000/markets/${encodeURIComponent(marketId)}/depth`,
	);
	const outputGetDepth = responseGetDepth.data;
	expect(outputGetDepth.buys).toHaveLength(0);
	expect(outputGetDepth.sells).toHaveLength(0);
});

test('Deve criar duas ordens de compra e uima ordem de venda, no mesmo valor e mesma quantidade', async () => {
	const marketId = `BTC/USD/${Math.random()}`;
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
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 10000000,
	};
	await axios.post('http://localhost:3000/deposit', inputDeposit);
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 1,
		price: 85000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'sell',
		quantity: 3,
		price: 85000,
	});
	const responseGetDepth = await axios.get(
		`http://localhost:3000/markets/${encodeURIComponent(marketId)}/depth`,
	);
	const outputGetDepth = responseGetDepth.data;
	expect(outputGetDepth.buys).toHaveLength(0);
	expect(outputGetDepth.sells).toHaveLength(1);
});

test('Deve criar 3 ordens de compra e venda, com valores diferentes', async () => {
	const marketId = `BTC/USD/${Math.random()}`;
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
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 10000000,
	};
	await axios.post('http://localhost:3000/deposit', inputDeposit);
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'sell',
		quantity: 1,
		price: 82000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'sell',
		quantity: 1,
		price: 84000,
	});
	await axios.post('http://localhost:3000/place_order', {
		accountId: outputSignup.accountId,
		marketId,
		side: 'buy',
		quantity: 2,
		price: 85000,
	});

	const responseGetDepth = await axios.get(
		`http://localhost:3000/markets/${encodeURIComponent(marketId)}/depth`,
	);
	const outputGetDepth = responseGetDepth.data;
	expect(outputGetDepth.buys).toHaveLength(0);
	expect(outputGetDepth.sells).toHaveLength(0);
});
