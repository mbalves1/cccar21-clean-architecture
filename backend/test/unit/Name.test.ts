import Name from '../../src/domain/Name';

test.each(['John Doe'])('Deve validar o nome: %s', (name: string) => {
	expect(new Name(name)).toBeDefined();
});

test.each(['John', ''])('Não deve validar o nome: %s', (name: string) => {
	expect(() => new Name(name)).toThrow(new Error('Invalid name'));
});
