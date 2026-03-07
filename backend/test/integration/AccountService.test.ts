import AccountService from '../../src/application/service/AccountService';
import sinon from 'sinon';
import Registry from '../../src/infra/di/Registry';
import {
	AccountDAODatabase,
	AccountDAOMemory,
} from './../../src/infra/dao/AccountDAO';
import { AccountAssetDAODatabase } from './../../src/infra/dao/AccountAssetDAO';
import crypto from 'crypto';
import DatabaseConnection, {
	PgPromiseAdapter,
} from './../../src/infra/database/DatabaseConnection';

let connection: DatabaseConnection;
let accountService: AccountService;

beforeEach(() => {
	connection = new PgPromiseAdapter();
	Registry.getInstance().provide('databaseConnection', connection);
	const accountDAO = new AccountDAODatabase();
	Registry.getInstance().provide('accountDAO', accountDAO);
	Registry.getInstance().provide(
		'accountAssetDAO',
		new AccountAssetDAODatabase(),
	);
	// const accountDAO = new AccountDAOMemory();
	accountService = new AccountService();
});

test('Deve criar uma conta', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await accountService.signup(input);
	const outputGetAccount = await accountService.getAccount(
		outputSignup.accountId,
	);
	expect(outputSignup.accountId).toBeDefined();
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
	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid name'),
	);
});

test('Não deve criar uma conta se email for inválido', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid email'),
	);
});

test('Não deve criar uma conta se documento for inválido', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '872222888',
		password: 'mnbVCX1234',
	};

	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid document'),
	);
});

test('Não deve criar uma conta se a senha for inválido', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX',
	};

	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid password'),
	);
});

test('Não deve criar uma conta se a senha tiver menos de 8 caracteres', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX',
	};

	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid password'),
	);
});

test('Não deve criar uma conta se a senha não tiver números', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCXERT',
	};

	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid password'),
	);
});

test('Não deve criar uma conta se a senha não tiver maiusculas', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbvhhdjjdh233',
	};

	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid password'),
	);
});

test('Não deve criar uma conta se a senha não tiver minusculas', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'MSIKADI@#123232',
	};

	await expect(() => accountService.signup(input)).rejects.toThrow(
		new Error('Invalid password'),
	);
});

test('Deve criar uma conta com stub', async () => {
	const saveStub = sinon.stub(AccountDAODatabase.prototype, 'save').resolves();
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const getByIdStub = sinon
		.stub(AccountDAODatabase.prototype, 'getById')
		.resolves(input);

	const outputSignup = await accountService.signup(input);
	const outputGetAccount = await accountService.getAccount(
		outputSignup.accountId,
	);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
	saveStub.restore();
	getByIdStub.restore();
});

test('Deve criar uma conta com spy', async () => {
	const saveSpy = sinon.spy(AccountDAODatabase.prototype, 'save');
	const getByIdSpy = sinon.spy(AccountDAODatabase.prototype, 'getById');
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await accountService.signup(input);
	const outputGetAccount = await accountService.getAccount(
		outputSignup.accountId,
	);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
	expect(saveSpy.calledOnce).toBe(true);
	expect(getByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
	saveSpy.restore();
	getByIdSpy.restore();
});

test('Deve criar uma conta com mock', async () => {
	const accountDAOMock = sinon.mock(AccountDAODatabase.prototype);
	accountDAOMock.expects('save').once().resolves();
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};
	accountDAOMock.expects('getById').once().resolves(input);
	const outputSignup = await accountService.signup(input);
	const outputGetAccount = await accountService.getAccount(
		outputSignup.accountId,
	);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
	accountDAOMock.verify();
	accountDAOMock.restore();
});

test('Deve criar uma conta com fake', async () => {
	const accountDAO = new AccountDAOMemory();
	Registry.getInstance().provide('accountDAO', accountDAO);
	accountService = new AccountService();
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await accountService.signup(input);
	const outputGetAccount = await accountService.getAccount(
		outputSignup.accountId,
	);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
});

test('Deve depositar em uma conta', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await accountService.signup(input);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 100,
	};
	await accountService.deposit(inputDeposit);
	const outputGetAccount = await accountService.getAccount(
		outputSignup.accountId,
	);
	expect(outputGetAccount.balances[0].asset_id).toBe('USD');
	expect(outputGetAccount.balances[0].quantity).toBe('100');
});

test('Não deve depositar em uma conta que não existe', async () => {
	const inputDeposit = {
		accountId: crypto.randomUUID(),
		assetId: 'USD',
		quantity: 100,
	};
	await expect(() => accountService.deposit(inputDeposit)).rejects.toThrow(
		new Error('Account not found!'),
	);
});

test('Deve sacar de uma conta', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await accountService.signup(input);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 1000,
	};
	await accountService.deposit(inputDeposit);
	const inputWithDraw = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 300,
	};
	await accountService.withDraw(inputWithDraw);
	const outputGetAccount = await accountService.getAccount(
		outputSignup.accountId,
	);
	expect(outputGetAccount.balances[0].asset_id).toBe('USD');
	expect(outputGetAccount.balances[0].quantity).toBe('700');
});

test('Não deve sacar de uma conta se não tiver saldo', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await accountService.signup(input);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 500,
	};
	await accountService.deposit(inputDeposit);
	const inputWithDraw = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 1000,
	};
	await expect(() => accountService.withDraw(inputWithDraw)).rejects.toThrow(
		new Error('Insuficient funds'),
	);
});

afterEach(async () => {
	await connection.close();
});
