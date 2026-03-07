import Account from '../../src/domain/Account';

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
