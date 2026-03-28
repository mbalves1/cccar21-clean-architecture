import Password from '../../src/domain/Password';

test.each(['asdWQWEW1233'])('Deve validar a senha: %s', (password: string) => {
	expect(new Password(password)).toBeDefined();
});

test.each(['asd', 'asdWQWEW', 'asd1233', 'WQWEW1233'])(
	'Não deve validar a senha: %s',
	(password: string) => {
		expect(() => new Password(password)).toThrow(new Error('Invalid password'));
	},
);
