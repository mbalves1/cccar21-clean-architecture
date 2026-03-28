import Document from '../../src/domain/Document';

test.each(['078.300.210-66', '562.523.340-30', '639.951.250-69'])(
	'Deve testar um cpf valido: %s',
	(cpf: string) => {
		const document = new Document(cpf);
		expect(document).toBeDefined();
	},
);

test.each([null, undefined, '11111111111', '560-30', '639.001.000-00'])(
	'Deve testar um cpf invalido: %s',
	(cpf: any) => {
		expect(() => new Document(cpf)).toThrow(new Error('Invalid document'));
	},
);
