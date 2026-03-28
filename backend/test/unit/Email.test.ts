import Email from '../../src/domain/Email';

test.each(['john.doe@email.com'])(
	'Deve validar o email: %s',
	(email: string) => {
		expect(new Email(email)).toBeDefined();
	},
);

test.each(['john.doe@', 'john.doe@email', 'johnemail.com'])(
	'Não deve validar o email: %s',
	(email: string) => {
		expect(() => new Email(email)).toThrow(new Error('Invalid email'));
	},
);
