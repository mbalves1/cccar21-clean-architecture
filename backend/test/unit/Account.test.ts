import Account from '../../src/domain/Account';

test('Deve criar uma conta', function () {
	const account = Account.create(
		'John Doe',
		'john.doe@email.com',
		'078.300.210-66',
		'asdaaSsd23@',
	);
	expect(account.getName()).toBe('John Doe');
	expect(account.getEmail()).toBe('john.doe@email.com');
	expect(account.getDocument()).toBe('078.300.210-66');
	expect(account.getPassword()).toBe('asdaaSsd23@');
});

test('Não deve criar uma conta com nome invalido', function () {
	expect(() =>
		Account.create(
			'John',
			'john.doe@email.com',
			'078.300.210-66',
			'asdaaSsd23@',
		),
	).toThrow(new Error('Invalid name'));
});

test('Não deve criar uma conta com email invalido', function () {
	expect(() =>
		Account.create(
			'John Doe',
			'john.doe@email',
			'078.300.210-66',
			'asdaaSsd23@',
		),
	).toThrow(new Error('Invalid email'));
});

test('Não deve criar uma conta com documento invalido', function () {
	expect(() =>
		Account.create(
			'John Dow',
			'john.doe@email.com',
			'078.300.6',
			'asdaaSsd23@',
		),
	).toThrow(new Error('Invalid document'));
});

test('Não deve criar uma conta com senha invalido', function () {
	expect(() =>
		Account.create('John Dow', 'john.doe@email.com', '078.300.210-66', 'asdaa'),
	).toThrow(new Error('Invalid password'));
});

test('Deve fazer um saque', function () {
	const account = Account.create(
		'John Doe',
		'john.doe@email.com',
		'078.300.210-66',
		'asdaaSsd23@',
	);
	account.deposit('USD', 500);
	account.withdraw('USD', 100);
	expect(account.balances[0].quantity).toBe(400);
});

test('Não deve fazer um saque se não tiver saldo', function () {
	const account = Account.create(
		'John Doe',
		'john.doe@email.com',
		'078.300.210-66',
		'asdaaSsd23@',
	);
	account.deposit('USD', 500);
	expect(() => account.withdraw('USD', 1000)).toThrow(
		new Error('Insuficient funds'),
	);
});
